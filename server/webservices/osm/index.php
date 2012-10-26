<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');

// Load Slim library
\Slim\Slim::registerAutoloader();

// create Slim app
$app = new \Slim\Slim();

$osmHandler = function ($type, $id) {
    $osmApiUrl = 'http://www.openstreetmap.org/api/0.6';
    $url = $osmApiUrl . '/' . $type . '/' . $id;
    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($curl);

    curl_close($curl);

    echo $result;
};

// define REST resources
$app->get('/:type/:id', $osmHandler);


// start Slim app
$app->run();
