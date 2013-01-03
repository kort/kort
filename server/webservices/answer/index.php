<?php
/**
 * kort - the /answer webservices
 */

/** Load Slim library */
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
/** Load ClassLoader */
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();

// create Slim app
$app = new \Slim\Slim();
$slim = new \Helper\SlimHelper($app);

$answerHandler = new \Webservice\Answer\AnswerHandler();

$app->get(
    '/(:type)',
    function ($type = null) use ($answerHandler, $app, $slim) {
        $answerHandler->setLanguage($app->request()->params('lang'));
        if (empty($type)) {
             $answers = $answerHandler->getAllAnswers();
        } else {
            $answers = $answerHandler->getSpecificAnswers($type);
        }

        $slim->returnData($answers);
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
