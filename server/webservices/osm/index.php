<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

use Webservice\OsmHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();

$res = $app->response();
$res['Content-Type'] = 'text/xml';

$handler = new OsmHandler();
$osmHandler = function ($type, $id, $full) use ($handler, $res) {
    $res->write($handler->getOsmData($type, $id, $full));
};

// define REST resources
$app->get('/:type/:id/:full', $osmHandler);


// start Slim app
$app->run();
