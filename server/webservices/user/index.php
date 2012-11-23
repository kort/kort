<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

use Webservice\User\UserHandler;
use Webservice\User\UserGetHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();
$app = new \Slim\Slim();
$res = $app->response();

 \session_start();

$userHandler = new UserHandler();
$userGetHandler = new UserGetHandler();

// define REST resources
$app->get(
    '/:id',
    function ($id) use ($userGetHandler, $res) {
        $userData = $userGetHandler->getUser($id);

        if (!$userData) {
            $res->status(403);
        } else {
            $res->write($userData);
        }
    }
);

$app->get(
    '/:id/badges',
    function ($id) use ($userGetHandler, $res) {
        $res->write($userGetHandler->getUserBadges($id));
    }
);

$app->post(
    '/',
    function () use ($userHandler, $app) {
        $userHandler->insertUser($app->request()->getBody());
    }
);

$app->put(
    '/:id',
    function ($id) use ($userHandler, $app) {
        $userHandler->updateUser($id, $app->request()->put());
    }
);

$app->get(
    '/logout',
    function () use ($res) {
        \session_destroy();
        $res->write("Congratulations! You've now officially logged out!");
    }
);

// start Slim app
$app->run();
