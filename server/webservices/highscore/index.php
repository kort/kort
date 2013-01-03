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
    '/',
    function () use ($highscoreHandler, $app, $slim) {
        $highscoreHandler->setLanguage($app->request()->params('lang'));
        $limit = $app->request()->params('limit');
        $highscoreData = $highscoreHandler->getHighscore($limit);
        $slim->returnData($highscoreData);
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
