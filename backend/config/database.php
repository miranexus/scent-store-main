<?php
/**
 * Database configuration — not active in the current scope.
 *
 * The project currently serves product data from a static JSON file
 * (backend/data/products.json). Uncomment getDbConnection() and update
 * the constants below to switch to a MySQL data source.
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'scentstore');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/*
function getDbConnection(): PDO
{
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=%s',
        DB_HOST,
        DB_NAME,
        DB_CHARSET
    );
    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}
*/
