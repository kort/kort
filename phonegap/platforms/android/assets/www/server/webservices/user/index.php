<?php
/**
 * kort - the /user webservices
 */

/** Load Slim library */
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
/** Load ClassLoader */
require_once('../../../server/php/ClassLoader.php');

use Webservice\User\UserHandler;
use Webservice\User\UserGetHandler;
use Webservice\User\UserBadgesHandler;
use Helper\SlimHelper;

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();
$app = new \Slim\Slim();
$slim = new SlimHelper($app);

 \session_start();

$userHandler = new UserHandler();
$userGetHandler = new UserGetHandler();
$userBadgesHandler = new UserBadgesHandler();

// define REST resources
$app->get(
    '/(:secret)',
    function ($secret = null) use ($userGetHandler, $slim) {
        if (empty($secret) && isset($_SESSION['secret'])) {
            $secret = $_SESSION['secret'];
        }
        $userData = $userGetHandler->getUserBySecret($secret);
        $slim->returnData($userData);
    }
);

$app->get(
    '/:id/badges',
    function ($id) use ($userBadgesHandler, $slim, $app) {
        $userBadgesHandler->setLanguage($app->request()->params('lang'));
        $userBadges = $userBadgesHandler->getUserBadges($id);
        $slim->returnData($userBadges);
    }
);

$app->get(
    '/:id/logout',
    function () use ($app) {
        \session_destroy();
        $app->response()->write("Congratulations! You've now officially logged out!");
    }
);

$app->put(
    '/(:id)',
    function ($id = null) use ($userHandler, $app) {
        if (empty($id)) {
            $id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : -1;
        }
        $data = json_decode($app->request()->getBody(), true);

        //only allow certain attributes to be set via the webservice
        $allowedAttributes = array("username");
        $allowedData = array();
        foreach ($allowedAttributes as $attribute) {
            $allowedData[$attribute] = $data[$attribute];
        }
        $app->response()->write($userHandler->updateUser($id, $allowedData));
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
