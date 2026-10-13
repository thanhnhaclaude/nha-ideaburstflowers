<?php
/**
 * Shared helpers for the PHP endpoints. Runs on Hostinger shared hosting (PHP 8.1+).
 *
 * Secrets live OUTSIDE public_html in ~/ideaburst-config.php (see README), e.g.:
 *   <?php return [
 *     'stripe_secret' => 'sk_live_...',
 *     'site_url'      => 'https://ideaburstflowers.com',
 *     'mail_to'       => 'contact@ideaburstflowers.com',
 *     'mail_from'     => 'no-reply@ideaburstflowers.com',
 *   ];
 */

declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

function ib_config(): array
{
    static $cfg = null;
    if ($cfg !== null) return $cfg;

    $candidates = [
        dirname(__DIR__, 2) . '/ideaburst-config.php', // ~/ideaburst-config.php when site is in ~/public_html
        dirname(__DIR__, 3) . '/ideaburst-config.php', // ~/ideaburst-config.php for addon domains (~/domains/x/public_html)
    ];
    $cfg = [];
    foreach ($candidates as $file) {
        if (is_readable($file)) {
            $cfg = (array) require $file;
            break;
        }
    }
    $cfg += [
        'stripe_secret' => getenv('STRIPE_SECRET_KEY') ?: '',
        'site_url'      => getenv('SITE_URL') ?: '',
        'mail_to'       => getenv('MAIL_TO') ?: '',
        'mail_from'     => getenv('MAIL_FROM') ?: '',
    ];
    return $cfg;
}

function ib_fail(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

function ib_ok(array $data = []): never
{
    echo json_encode(['ok' => true] + $data);
    exit;
}

/** Only accept JSON POSTs from our own origin. */
function ib_read_json(): array
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') ib_fail(405, 'Method not allowed.');

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $host = $_SERVER['HTTP_HOST'] ?? '';
    if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== $host) ib_fail(403, 'Forbidden.');

    $raw = file_get_contents('php://input', false, null, 0, 64 * 1024) ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) ib_fail(400, 'Invalid request.');
    return $data;
}

/** Very small file-based rate limiter: $max requests per $window seconds per IP. */
function ib_rate_limit(string $bucket, int $max, int $window): void
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $file = sys_get_temp_dir() . '/ib_rl_' . $bucket . '_' . md5($ip);
    $now = time();
    $hits = [];
    if (is_readable($file)) {
        $hits = array_filter((array) json_decode((string) file_get_contents($file), true), fn($t) => is_int($t) && $t > $now - $window);
    }
    if (count($hits) >= $max) ib_fail(429, 'Too many requests. Please wait a minute and try again.');
    $hits[] = $now;
    @file_put_contents($file, json_encode(array_values($hits)), LOCK_EX);
}

function ib_str(mixed $v, int $max): string
{
    $s = is_string($v) ? trim($v) : '';
    $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
    return mb_substr($s, 0, $max);
}

function ib_catalog(): array
{
    static $catalog = null;
    if ($catalog === null) {
        $catalog = json_decode((string) @file_get_contents(__DIR__ . '/catalog.json'), true);
        if (!is_array($catalog)) ib_fail(500, 'Catalog unavailable.');
    }
    return $catalog;
}

function ib_site_url(): string
{
    $url = ib_config()['site_url'];
    if ($url === '') {
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $url = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
    }
    return rtrim($url, '/');
}
