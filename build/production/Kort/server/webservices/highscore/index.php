<?php
/**
 * kort - the /highscore webservices
 */

/** Load Slim library */
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
/** Load ClassLoader */
require_once('../../../server/php/ClassLoader.php');

use Webservice\Highscore\HighscoreHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();
$app = new \Slim\Slim();
$slim = new \Helper\SlimHelper($app);

 \session_start();

$highscoreHandler = new HighscoreHandler();

// define REST resources
$app->get(
    '/absolute',
    function () use ($highscoreHandler, $app, $slim) {
        $highscoreHandler->setLanguage($app->request()->params('lang'));
        $limit = $app->request()->params('limit');
        $page = $app->request()->params('page');

        if (!$limit) {
            $limit = 10;
        }
        if (!$page) {
            $page = 1;
        }

        if ($app->request()->headers('PHP_AUTH_USER')) {
            $user_id = $app->request()->headers('PHP_AUTH_USER');
        } else {
            $user_id = $_SESSION['user_id'];
        }

        $highscoreData = $highscoreHandler->getAbsoluteHighscore($limit, $page, $user_id);
        $app->response()->write($highscoreData);
        //$slim->returnData($highscoreData);
    }
);

$app->get(
    '/relative',
    function () use ($highscoreHandler, $app, $slim) {
        $highscoreHandler->setLanguage($app->request()->params('lang'));
        $limit = $app->request()->params('limit');
        $page = $app->request()->params('page');

        if (!$limit) {
            $limit = 10;
        }
        if (!$page) {
            $page = 1;
        }

        if ($app->request()->headers('PHP_AUTH_USER')) {
            $user_id = $app->request()->headers('PHP_AUTH_USER');
        } else {
            $user_id = $_SESSION['user_id'];
        }
        $highscoreData = $highscoreHandler->getRelativeHighscore($limit, $page, $user_id);
        $slim->returnData($highscoreData);
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
