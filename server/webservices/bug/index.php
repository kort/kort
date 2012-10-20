<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('config.php');
require_once('RelayHandler.php');

use Kort\Webservice\RelayHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();

// create Slim app
$app = new \Slim\Slim();

// define REST resources
$app->get(
    '/:path+',
    function ($path) use ($app) {
        $relay = new RelayHandler($app);
        $relay->relayHandler($path);
    }
);

// start Slim app
$app->run();
