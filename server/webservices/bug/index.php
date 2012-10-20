<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('config.php');
require_once('RelayHandler.php');
require_once('RelayHandlerGet.php');
require_once('RelayHandlerPost.php');

use Kort\Webservice\RelayHandlerPost;
use Kort\Webservice\RelayHandlerGet;

// Load Slim library
\Slim\Slim::registerAutoloader();

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
