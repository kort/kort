<?php
/**
 * kort - the /promotion webservices
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

$promotionHandler = new \Webservice\Promotion\PromotionHandler();

$app->get(
    '/',
    function () use ($promotionHandler, $app, $slim) {
        $promotionHandler->setLanguage($app->request()->params('lang'));
        $promotionData = $promotionHandler->getAllPromotions();
        $slim->returnData($promotionData);
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
