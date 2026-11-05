<?php
/**
 * Entry point — redirects to the products API endpoint.
 * When running `php -S localhost:8080 -t backend`, visiting
 * http://localhost:8080 will land here.
 */
header('Location: /api/index.php?path=/products');
exit();
