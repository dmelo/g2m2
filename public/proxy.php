<?php

require '../vendor/autoload.php';

$domainMap = json_decode(file_get_contents(__DIR__ . '/../public/js/DomainMap.json'), true);

$domain = $_SERVER['HTTP_HOST'];

$user = $repo = $path = null;

if (isset($domainMap[$domain])) {
    $user = $domainMap[$domain]['user'];
    $repo = $domainMap[$domain]['repo'];
    $path = $_SERVER['REQUEST_URI'];
} else {
    $user = preg_replace('/^([^\.]*)\..*/', '\1', $domain);
    $repo = preg_replace('/^\/([^\/]*)\/.*/', '\1', $_SERVER['REQUEST_URI']);
    $path = preg_replace('/^\/[^\/]*(\/.*)/', '\1', $_SERVER['REQUEST_URI']);
}
$ext = strtolower(preg_replace('/^.*\./', '', $_SERVER['REQUEST_URI']));
$fileTypeMap = [
    'txt' => 'text/plain',
    'xml' => 'text/xml',
    'json' => 'application/json',
];

$client = new \Github\Client();

try {
    $fileContent = $client->api('repo')->contents()->download($user, $repo, $path);

    if (isset($fileTypeMap[$ext])) {
        header('Content-Type: ' . $fileTypeMap[$ext]);
    }

    echo $fileContent;
} catch (\Github\Exception\RuntimeException $e) {
    echo $e->getMessage() . $e->getTraceAsString() . PHP_EOL;
}
