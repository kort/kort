<?php
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

// start Slim app
$app->run();
