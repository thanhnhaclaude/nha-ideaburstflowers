<?php
/**
 * POST /api/inquiry.php
 * Handles contact, wedding/event inquiries and newsletter sign-ups by emailing
 * the studio (PHP mail() works out of the box on Hostinger).
 */

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

$req = ib_read_json();
ib_rate_limit('inquiry', 6, 300);

// Honeypot: bots fill the hidden "website" field. Pretend success.
if (ib_str($req['website'] ?? '', 200) !== '') ib_ok();

$type = in_array($req['type'] ?? '', ['contact', 'event', 'newsletter', 'review'], true) ? $req['type'] : 'contact';
$email = filter_var(ib_str($req['email'] ?? '', 200), FILTER_VALIDATE_EMAIL);
if (!$email) ib_fail(422, 'Please enter a valid email address.');

$fields = [
    'name' => 'Name',
    'phone' => 'Phone',
    'topic' => 'Topic',
    'eventType' => 'Event type',
    'eventDate' => 'Event date',
    'guests' => 'Guests',
    'venue' => 'Venue',
    'budget' => 'Budget',
    'displayName' => 'Display name',
    'city' => 'City',
    'occasion' => 'Occasion',
    'message' => 'Message',
];

$lines = ["Type: " . ucfirst($type), "Email: {$email}"];
foreach ($fields as $key => $label) {
    $val = ib_str($req[$key] ?? '', $key === 'message' ? 3000 : 200);
    if ($val !== '') $lines[] = "{$label}: {$val}";
}
if ($type !== 'newsletter' && ib_str($req['message'] ?? '', 10) === '') ib_fail(422, 'Please include a message.');
if ($type === 'review') {
    if (($req['consent'] ?? false) !== true) ib_fail(422, 'Please confirm we may publish your review.');
    $rating = max(1, min(5, (int) ($req['rating'] ?? 5)));
    $lines[] = "Rating: {$rating}/5";
    $lines[] = 'Publish consent: YES (' . gmdate('Y-m-d H:i') . ' UTC, IP ' . ($_SERVER['REMOTE_ADDR'] ?? '?') . ')';
    $lines[] = 'Photo consent: ' . (($req['photoConsent'] ?? false) === true ? 'YES — email customer to request photo' : 'no');
}

$cfg = ib_config();
$host = preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'ideaburstflowers.com');
$to = $cfg['mail_to'] ?: 'contact@' . $host;
$fromAddr = $cfg['mail_from'] ?: 'no-reply@' . $host;
$name = ib_str($req['name'] ?? '', 100);

$subjects = [
    'contact' => 'New website message',
    'event' => 'New wedding/event inquiry',
    'newsletter' => 'New newsletter subscriber',
    'review' => 'New customer review',
];
$subject = '[IdeaBurst] ' . $subjects[$type] . ($name !== '' ? " — {$name}" : '');
$body = implode("\n", $lines) . "\n\n— Sent from " . $host . ' on ' . gmdate('Y-m-d H:i') . " UTC\n";

// Strip CR/LF from anything that goes into headers (header-injection guard).
$safe = fn(string $s): string => str_replace(["\r", "\n"], '', $s);
$headers = [
    'From: IdeaBurst Website <' . $safe($fromAddr) . '>',
    'Reply-To: ' . $safe($name !== '' ? "{$name} <{$email}>" : $email),
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: IdeaBurst',
];

$sent = @mail($to, '=?UTF-8?B?' . base64_encode($safe($subject)) . '?=', $body, implode("\r\n", $headers), '-f' . $safe($fromAddr));

// Keep a private backup log outside the web root in case mail is delayed.
$logDir = dirname(__DIR__, 2) . '/ideaburst-inquiries';
if (is_dir($logDir) || @mkdir($logDir, 0700, true)) {
    @file_put_contents($logDir . '/' . gmdate('Y-m') . '.log', json_encode(['at' => gmdate('c'), 'type' => $type, 'lines' => $lines]) . "\n", FILE_APPEND | LOCK_EX);
}

if (!$sent) {
    error_log('[ideaburst inquiry] mail() failed for ' . $type);
    ib_fail(502, 'We couldn\'t send your message just now. Please email or call us directly.');
}

ib_ok();
