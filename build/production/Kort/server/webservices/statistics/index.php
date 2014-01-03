<?php
/**
 * kort - the /statistics webservices
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

$statisticsHandler = new \Webservice\Statistics\StatisticsHandler();

$app->get(
    '/',
    function () use ($statisticsHandler, $app, $slim) {
        $statistics = $statisticsHandler->getStatistics();
        
        if (json_decode($statistics, true) === null) {
            $this->app->response()->status(404);
        }
        
        $callback = $app->request()->params('callback');
        if (empty($callback)) {
            $slim->returnData($statistics);
        } else {
            // generate JSONP return value
            if (empty($statistics)) {
                $statistics = '[]';
            }
            $app->response()->header('Content-Type', 'application/x-javascript');
            $app->response()->write($callback . "({\"return\":". $statistics . "});");
        }
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
