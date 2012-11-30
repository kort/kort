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
    '/(:type)',
    function ($type = null) use ($answerHandler, $app) {
        $limit = $app->request()->params('limit');
        if (empty($type)) {
             $response = $answerHandler->getAllAnswers($limit);
        } else {
            $response = $answerHandler->getSpecificAnswers($type, $limit);
        }

        if (!empty($response)) {
            $app->response()->write($response);
        } else {
            $app->response()->status(404);
        }
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
