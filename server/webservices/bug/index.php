<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

use Webservice\RelayHandlerPost;
use Webservice\RelayHandlerGet;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();

// define REST resources
$app->get(
    '/:path+',
    function ($path) use ($app) {
        $relay = new RelayHandlerGet($app);
        $relay->relayHandler($path);
    }
);

$app->post(
    '/:path+',
    function ($path) use ($app) {
        $relay = new RelayHandlerPost($app);
        $relay->relayHandler($path);
    }
);

// start Slim app
$app->run();
