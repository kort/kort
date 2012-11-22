<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();
$answerHandler = new \Webservice\Answer\AnswerHandler();

$app->get(
    '/',
    function () use ($answerHandler, $app) {
        $limit = $app->request()->params('limit');
        $app->response()->write($answerHandler->getAllAnswers($limit));
    }
);

$app->get(
    '/:type',
    function ($type) use ($answerHandler, $app) {
        $limit = $app->request()->params('limit');
        $app->response()->write($answerHandler->getSpecificAnswers($type, $limit));
    }
);

// start Slim app
$app->run();
