<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

use Webservice\User\UserHandler;
use Webservice\User\UserGetHandler;
use Webservice\User\UserBadgesHandler;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();
$app = new \Slim\Slim();
$res = $app->response();

 \session_start();

$userHandler = new UserHandler();
$userGetHandler = new UserGetHandler();
$userBadgesHandler = new UserBadgesHandler();

// define REST resources
$app->get(
    '/(:secret)',
    function ($secret = null) use ($userGetHandler, $res) {
        if (empty($secret) && isset($_SESSION['secret'])) {
            $secret = $_SESSION['secret'];
        }
        $userData = $userGetHandler->getUserBySecret($secret);
        $res->write($userData);
    }
);

$app->get(
    '/:id/badges',
    function ($id) use ($userBadgesHandler, $res) {
        $res->write($userBadgesHandler->getUserBadges($id));
    }
);

$app->get(
    '/:id/logout',
    function () use ($res) {
        \session_destroy();
        $res->write("Congratulations! You've now officially logged out!");
    }
);

$app->post(
    '/',
    function () use ($userHandler, $app) {
        $data = json_decode($app->request()->getBody(), true);
        $app->response()->write($userHandler->insertUser(), $data);
    }
);

$app->put(
    '/(:id)',
    function ($id = null) use ($userHandler, $app) {
        if (empty($id)) {
            $id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : -1;
        }
        $data = json_decode($app->request()->getBody(), true);
        $app->response()->write($userHandler->updateUser($id, $data));
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
