<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();


$app = new \Slim\Slim();
$res = $app->response();

$bugHandler = new \Webservice\Bug\BugHandler();
$fixHandler = new \Webservice\Fix\FixHandler();

// define REST resources
$app->get('/bugs/:schema/:id', $bugHandler->bugsIdRouteHandler($res));
$app->get('/bugs/bounds/:northeastlat,:northeastlng/:southwestlat,:southwestlng', $bugHandler->bugsBoundsHandler($res));
$app->post('/fixes', $fixHandler->fixesRouteHandler($app));

// start Slim app
$app->run();
