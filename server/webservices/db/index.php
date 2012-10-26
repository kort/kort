<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../php/Webservice/RouteHandler.php');

use Webservice\RouteHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();

// create Slim app
$app = new \Slim\Slim();

//define route handlers
$handler = new RouteHandler();

$rootHandler = function () use ($handler) {
    $handler->rootRouteHandler();
};

$bugsIdHandler = function ($schema, $id) use ($handler) {
    $handler = new RouteHandler();
};

$bugsBoundsHandler = function ($northEastLat, $northEastLng, $southWestLat, $southWestLng) use ($handler) {
    $handler->bugsBoundsRouteHandler($northEastLat, $northEastLng, $southWestLat, $southWestLng);
};

$fixesHandler = function () use ($handler, $app) {
    $handler->fixesRouteHandler($app->request()->post());
};

// define REST resources
$app->get('/', $rootHandler);
$app->get('/bugs/:schema/:id', $bugsIdHandler);
$app->get('/bugs/bounds/:northeastlat,:northeastlng/:southwestlat,:southwestlng', $bugsBoundsHandler);
$app->post('/fixes', $fixesHandler);

// start Slim app
$app->run();
