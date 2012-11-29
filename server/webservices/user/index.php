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
    '/(:id)',
    function ($id = null) use ($userGetHandler, $res) {
        if (empty($id)) {
            $id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : -1;
        }

        $userData = $userGetHandler->getUser($id);

        if ($userData && isset($_SESSION['user_id']) && $_SESSION['user_id'] == $id) {
              $res->write($userData);
        } else {
            $user = array();
            $user['id'] = null;
            $user['name'] = "Anonymous";
            $user['username'] = "";
            $user["email"] = "";
            $user["token"] = "";
            $user["fix_count"] = 0;
            $user["validation_count"] = 0;
            $user["koin_count"] = 0;
            $user["pic_url"] = "";
            $user["logged_in"] = false;

            $res->write(json_encode($user));
        }
    }
);

$app->get(
    '/:id/badges',
    function ($id) use ($userGetHandler, $res) {
        $res->write($userGetHandler->getUserBadges($id));
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
    function ($id=null) use ($userHandler, $app) {
        if (empty($id)) {
            $id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : -1;
        }
        $data = json_decode($app->request()->getBody(), true);
        $app->response()->write($userHandler->updateUser($id, $data));
    }
);

// start Slim app
$app->run();
