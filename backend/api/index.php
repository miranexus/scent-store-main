<?php
/**
 * Front controller for the ScentStore API (same style as the showcase-angular-php API).
 *
 * GET /api/index.php?path=/health            -> status check
 * GET /api/index.php?path=/products          -> all products
 * GET /api/index.php?path=/products&category=Floral -> filtered products
 *
 * Data flow: Angular (HTTP GET) -> index.php -> reads data/products.json -> JSON array
 */

declare(strict_types=1);

// --- CORS + security headers ---
function send_cors_headers(): void {
    $allowed_origins = [
        'https://miranexus.com',
        'https://www.miranexus.com',
        'http://localhost:4200',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed_origins, true)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
}

function send_json(int $status, $payload): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit();
}

send_cors_headers();

// Respond to CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    send_json(405, ['error' => 'Method Not Allowed']);
}

$path = $_GET['path'] ?? '/health';

if ($path === '/health') {
    send_json(200, ['status' => 'ok']);
}

if ($path !== '/products') {
    send_json(404, ['error' => 'Not Found']);
}

// --- Products ---
// Deployed layout: api/scent-store/data/products.json (next to this file).
// Repo layout (php -S ... -t backend): backend/data/products.json.
$dataFile = null;
foreach ([__DIR__ . '/data/products.json', __DIR__ . '/../data/products.json'] as $candidate) {
    if (is_file($candidate)) {
        $dataFile = $candidate;
        break;
    }
}

if ($dataFile === null) {
    send_json(500, ['error' => 'Product data file not found']);
}

$products = json_decode((string) file_get_contents($dataFile), true);

if (!is_array($products)) {
    send_json(500, ['error' => 'Failed to parse product data']);
}

// Optional category filter
$category = trim((string) ($_GET['category'] ?? ''));
if ($category !== '') {
    $category = htmlspecialchars(strip_tags($category));
    $products = array_values(
        array_filter($products, fn($p) => ($p['category'] ?? null) === $category)
    );
}

send_json(200, $products);
