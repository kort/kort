<?php
/**
 * kort - the /update webservices
 */

/** Load Slim library */
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');

// Load Slim library
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();
$app->get(
    '/git',
    function () {
        system('git pull');
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
