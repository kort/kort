<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();
$res = $app->response();

$answerHandler = new \Webservice\Answer\AnswerHandler();

$app->get(
    '/',
    function () use ($answerHandler, $res) {
        $res->write($answerHandler->getAllAnswers());
    }
);

$app->get(
    '/:type',
    function ($type) use ($answerHandler, $res) {
        $res->write($answerHandler->getSpecificAnswers($type));
    }
);

// start Slim app
$app->run();
