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
$app->get(
    '/position/:lat,:lng',
    function ($lat, $lng) use ($bugHandler, $res) {
        $limit = (isset($_GET['limit'])) ? $_GET['limit'] : 20;

        $res->write($bugHandler->getBugsByOwnPosition($lat, $lng, $limit));
    }
);
$app->get(
    '/tracktypes',
    function () use ($bugHandler, $res) {
        $res->write($bugHandler->getTracktypes());
    }
);
$app->post(
    '/fixes',
    function () use ($fixHandler, $app) {
        $fixHandler->insertFix($app->request()->post());
    }
);

// start Slim app
$app->run();
