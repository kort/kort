<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();

$validationHandler = new \Webservice\Validation\ValidationHandler();
$voteHandler = new \Webservice\Vote\VoteHandler();

$app->get(
    '/position/:lat,:lng',
    function ($lat, $lng) use ($validationHandler, $app) {
        $limit = $app->request()->params('limit');
        $radius = $app->request()->params('radius');

        $app->response()->write($validationHandler->getValidationsByOwnPosition($lat, $lng, $limit, $radius));
    }
);

$app->post(
    '/vote',
    function () use ($voteHandler, $app) {
        $data = json_decode($app->request()->getBody(), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $app->response()->status(400);
            $app->response()->write("Invalid JSON given!");
        }
        $result = $voteHandler->insertVote($data);
        if (!$result) {
            $app->response()->status(400);
            $app->response()->write("Could not insert record: " . $result);
        } else {
            $app->response()->write($result);
        }
    }
);

// start Slim app
$app->run();
