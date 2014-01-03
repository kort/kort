<?php
/**
 * kort - the /bug webservices
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

$bugHandler = new \Webservice\Bug\BugHandler();
$fixHandler = new \Webservice\Fix\FixHandler();
$fixGetHandler = new \Webservice\Fix\FixGetHandler();

$app->get(
    '/position/:lat,:lng',
    function ($lat, $lng) use ($bugHandler, $app, $slim) {
        $bugHandler->setLanguage($app->request()->params('lang'));
        $limit = $app->request()->params('limit');
        $radius = $app->request()->params('radius');

        $bugData = $bugHandler->getBugsByOwnPosition($lat, $lng, $limit, $radius);
        $slim->returnData($bugData);
    }
);

$app->post(
    '/fix',
    function () use ($fixHandler, $app) {
        $fixHandler->setLanguage($app->request()->params('lang'));

        $data = json_decode($app->request()->getBody(), true);

        if (!isset($_SESSION) || $data['user_id'] != $_SESSION['user_id']) {
            $app->response()->status(403);
            $app->response()->write("Wrong user_id");
            return;
        }

        if (empty($data) || json_last_error() !== JSON_ERROR_NONE) {
            $app->response()->status(400);
            $app->response()->write("Invalid JSON given!");
            return;
        }
        $result = $fixHandler->insertFix($data);
        if (!$result) {
            $app->response()->status(400);
            $app->response()->write("Could not insert record: " . $result);
        } else {
            $app->response()->write($result);
        }
    }
);

$app->get(
    '/fix/completed',
    function () use ($fixGetHandler, $app) {
        $fixGetHandler->setLanguage($app->request()->params('lang'));
        $fixes = $fixGetHandler->getCompletedValidFixes();
        $app->response()->write($fixes);
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
