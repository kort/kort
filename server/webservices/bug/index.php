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
$res = $app->response();

$relayGet = new RelayHandlerGet($app);
$app->get(
    '/:path+',
    function ($path) use ($relayGet, $res) {
        $res->write($relayGet->relayHandler($path));
    }
);

$relayPost = new RelayHandlerPost($app);
$app->post(
    '/:path+',
    function ($path) use ($relayPost, $res) {
        $res->write($relayPost->relayHandler($path));
    }
);

// start Slim app
$app->run();
