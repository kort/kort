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
        $highscoreData = $highscoreHandler->getAbsoluteHighscore($limit, $page);
        $slim->returnData($highscoreData);
    }
);

$app->get(
    '/relative',
    function () use ($highscoreHandler, $app, $slim) {
        $highscoreHandler->setLanguage($app->request()->params('lang'));
        $limit = $app->request()->params('limit');
        $page = $app->request()->params('page');
        $highscoreData = $highscoreHandler->getRelativeHighscore($limit, $page);
        $slim->returnData($highscoreData);
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
