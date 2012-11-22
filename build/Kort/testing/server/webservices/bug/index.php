<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();

$bugHandler = new \Webservice\Bug\BugHandler();
$fixHandler = new \Webservice\Fix\FixHandler();

$app->get(
    '/position/:lat,:lng',
    function ($lat, $lng) use ($bugHandler, $app) {
        $limit = $app->request()->params('limit');
        $radius = $app->request()->params('radius');

        $app->response()->write($bugHandler->getBugsByOwnPosition($lat, $lng, $limit, $radius));
    }
);

$app->post(
    '/fix',
    function () use ($fixHandler, $app) {
        $app->response()->write($fixHandler->insertFix($app->request()->post()));
    }
);

// start Slim app
$app->run();
