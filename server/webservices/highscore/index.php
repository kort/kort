<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

use Webservice\Highscore\HighscoreHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();
$app = new \Slim\Slim();
$res = $app->response();

 \session_start();

$highscoreHandler = new HighscoreHandler();

// define REST resources
$app->get(
    '/',
    function () use ($highscoreHandler, $res) {
        $highscoreData = $highscoreHandler->getHighscore();
        $res->write($highscoreData);
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
