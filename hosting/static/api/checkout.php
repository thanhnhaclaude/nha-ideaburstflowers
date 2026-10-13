<?php
/**
 * POST /api/checkout.php
 * Creates a Stripe Checkout Session from the cart (or a subscription plan) and
 * returns its URL. Every price is recomputed here from catalog.json — the
 * browser only says *what* the customer wants, never *how much* it costs.
 */

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$req = ib_read_json();
ib_rate_limit('checkout', 12, 60);

$cfg = ib_config();
if ($cfg['stripe_secret'] === '') {
    ib_fail(503, 'Online checkout is being set up. Please call us to place your order — we answer 24/7.');
}

$catalog = ib_catalog();
$siteUrl = ib_site_url();
$tz = new DateTimeZone($catalog['delivery']['timezone'] ?? 'America/Denver');

// ---------- Delivery details ----------
$d = is_array($req['delivery'] ?? null) ? $req['delivery'] : [];
$zip = preg_replace('/\D/', '', ib_str($d['zip'] ?? '', 10));
$date = ib_str($d['date'] ?? '', 10);
$recipient = ib_str($d['recipient'] ?? '', 80);
$from = ib_str($d['from'] ?? '', 80);
$message = ib_str($d['message'] ?? '', 250);
$instructions = ib_str($d['instructions'] ?? '', 300);

$zone = null;
foreach ($catalog['delivery']['zones'] as $z) {
    if (in_array($zip, $z['zips'], true)) {
        $zone = $z;
        break;
    }
}
if ($zone === null) ib_fail(422, 'We don\'t deliver to that ZIP code yet. Please call us and we\'ll help arrange it.');
if ($recipient === '') ib_fail(422, 'Please add the recipient\'s name.');

$now = new DateTimeImmutable('now', $tz);
$sameDayOk = ($zone['sameDay'] ?? false) && (int) $now->format('G') < (int) ($catalog['delivery']['cutoffHour'] ?? 14);
$earliest = $sameDayOk ? $now->format('Y-m-d') : $now->modify('+1 day')->format('Y-m-d');
$latest = $now->modify('+90 days')->format('Y-m-d');
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || $date < $earliest || $date > $latest) {
    ib_fail(422, 'Please choose a delivery date between ' . $earliest . ' and ' . $latest . '.');
}

$prettyDate = (new DateTimeImmutable($date, $tz))->format('l, F j');
$cents = fn(float $usd): int => (int) round($usd * 100);

$metadata = [
    'delivery_date' => $date,
    'delivery_zip' => $zip,
    'delivery_zone' => $zone['name'],
    'recipient' => $recipient,
    'card_from' => $from,
    'card_message' => $message,
    'instructions' => $instructions,
];

$params = [
    'billing_address_collection' => 'auto',
    'shipping_address_collection' => ['allowed_countries' => ['US']],
    'phone_number_collection' => ['enabled' => 'true'],
    'success_url' => $siteUrl . '/checkout/success/?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => $siteUrl . '/checkout/cancel/',
    'custom_text' => [
        'shipping_address' => ['message' => "Enter the recipient's delivery address in ZIP {$zip}. Delivery: {$prettyDate}."],
    ],
];
if (!empty($cfg['stripe_tax'])) $params['automatic_tax'] = ['enabled' => 'true'];

$mode = ($req['mode'] ?? 'payment') === 'subscription' ? 'subscription' : 'payment';

if ($mode === 'payment') {
    // ---------- One-time order ----------
    $products = array_column($catalog['products'], null, 'id');
    $addons = array_column($catalog['addons'], null, 'id');
    $items = is_array($req['items'] ?? null) ? array_slice($req['items'], 0, 30) : [];
    if (!$items) ib_fail(422, 'Your bag is empty.');

    $lineItems = [];
    $summary = [];
    foreach ($items as $it) {
        $p = $products[$it['id'] ?? ''] ?? null;
        $qty = (int) ($it['qty'] ?? 0);
        if (!$p || $qty < 1 || $qty > 20) ib_fail(422, 'One of the items in your bag is no longer available. Please refresh and try again.');

        $unit = (float) $p['price'];
        $extraNames = [];
        foreach ((array) ($it['addons'] ?? []) as $aid) {
            if (!isset($addons[$aid])) continue;
            $unit += (float) $addons[$aid]['price'];
            $extraNames[] = $addons[$aid]['name'];
        }
        $extraNames = array_values(array_unique($extraNames));

        $productData = ['name' => $p['name'] . ' (' . $p['sku'] . ')'];
        if ($extraNames) $productData['description'] = 'Includes: ' . implode(', ', $extraNames);
        $img = $p['image'];
        $productData['images'] = [str_starts_with($img, '/') ? $siteUrl . $img : "https://images.unsplash.com/photo-{$img}?auto=format&fit=crop&w=600&h=750&q=75"];

        $lineItems[] = [
            'quantity' => $qty,
            'price_data' => ['currency' => 'usd', 'unit_amount' => $cents($unit), 'product_data' => $productData],
        ];
        $summary[] = $qty . 'x ' . $p['sku'] . ($extraNames ? ' +' . implode('/', $extraNames) : '');
    }

    if ((float) $zone['fee'] > 0) {
        $lineItems[] = [
            'quantity' => 1,
            'price_data' => ['currency' => 'usd', 'unit_amount' => $cents((float) $zone['fee']), 'product_data' => ['name' => 'Delivery — ' . $zone['name']]],
        ];
    }

    $metadata['items'] = mb_substr(implode('; ', $summary), 0, 490);
    $params += [
        'mode' => 'payment',
        'line_items' => $lineItems,
        'metadata' => $metadata,
        'payment_intent_data' => ['metadata' => $metadata, 'description' => 'Flowers for ' . $recipient . ' on ' . $date],
        'submit_type' => 'pay',
        'customer_creation' => 'always', // payment mode only; subscriptions always create a customer
    ];
} else {
    // ---------- Subscription ----------
    $sub = is_array($req['subscription'] ?? null) ? $req['subscription'] : [];
    $plans = array_column($catalog['plans'], null, 'id');
    $freqs = array_column($catalog['frequencies'], null, 'id');
    $plan = $plans[$sub['plan'] ?? ''] ?? null;
    $freq = $freqs[$sub['frequency'] ?? ''] ?? null;
    if (!$plan || !$freq) ib_fail(422, 'Please choose a subscription plan and frequency.');

    $unit = round((float) $plan['price'] * (100 - (int) $freq['discount'])) / 100;
    $metadata['plan'] = $plan['id'];
    $metadata['frequency'] = $freq['id'];
    $metadata['first_delivery'] = $date;

    $params += [
        'mode' => 'subscription',
        'line_items' => [[
            'quantity' => 1,
            'price_data' => [
                'currency' => 'usd',
                'unit_amount' => $cents($unit),
                'recurring' => ['interval' => $freq['interval'], 'interval_count' => (int) $freq['count']],
                'product_data' => ['name' => $plan['name'] . ' Flower Subscription — ' . $freq['name']],
            ],
        ]],
        'metadata' => $metadata,
        'subscription_data' => ['metadata' => $metadata, 'description' => 'First delivery ' . $date . ' for ' . $recipient],
    ];
}

// ---------- Call Stripe ----------
$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($params),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $cfg['stripe_secret'],
        'Stripe-Version: 2024-06-20',
        'Idempotency-Key: ' . bin2hex(random_bytes(16)),
    ],
]);
$body = curl_exec($ch);
$status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

$res = is_string($body) ? json_decode($body, true) : null;
if ($status !== 200 || empty($res['url'])) {
    error_log('[ideaburst checkout] Stripe error ' . $status . ': ' . ($curlErr ?: ($res['error']['message'] ?? 'unknown')));
    ib_fail(502, 'We couldn\'t open secure checkout just now. Please try again, or call us and we\'ll take your order by phone.');
}

ib_ok(['url' => $res['url']]);
