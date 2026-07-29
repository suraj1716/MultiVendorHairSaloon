<?php
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if (str_starts_with($uri, '/storage/')) {
    $path = __DIR__ . '/storage/app/public' . substr($uri, 8);

    if (file_exists($path) && !is_dir($path)) {
        $mime = mime_content_type($path);
        header('Content-Type: ' . $mime);
        readfile($path);
        exit;
    }
}
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    return false;
}
require_once __DIR__ . '/public/index.php';
