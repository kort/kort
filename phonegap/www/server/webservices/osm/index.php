<?php
/**
 * kort - the /osm webservices
 */

/** Load Slim library */
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
/** Load ClassLoader */
require_once('../../../server/php/ClassLoader.php');

use Webservice\Osm\OsmHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();

$res = $app->response();
$res['Content-Type'] = 'text/xml';

$handler = new OsmHandler();
$osmHandler = function ($type, $id) use ($handler, $res) {
    $res->write($handler->getOsmData($type, $id));
};

// define REST resources
$app->get('/:type/:id', $osmHandler);


if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
