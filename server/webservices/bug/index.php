<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../php/Webservice/DbConfig.php');
require_once('../../php/Webservice/DbWebserviceConfig.php');
require_once('../../php/Webservice/RelayHandler.php');
require_once('../../php/Webservice/RelayHandlerGet.php');
require_once('../../php/Webservice/RelayHandlerPost.php');

use Webservice\RelayHandlerPost;
use Webservice\RelayHandlerGet;

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
