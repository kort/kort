<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();


$app = new \Slim\Slim();

$dbHandler = new \Webservice\Database\DbHandler();

// define REST resources
$app->get(
    '/:table(/:fields)',
    function ($table, $fields = null) use ($dbHandler, $app) {
        if (!$dbHandler->checkAuth($app->request()->params('key'))) {
            $app->response()->status(403);
        } else {
            $fields = (isset($fields) ? explode(",", $fields) : null);
            $where = $app->request()->params('where');
            $orderBy = $app->request()->params('orderby');
            $limit = $app->request()->params('limit');

            $app->response()->write($dbHandler->doSelect($fields, $table, $where, $orderBy, $limit));
        }
    }
);

$app->post(
    '/:table/:fields',
    function ($table, $fields) use ($dbHandler, $app) {
        $request = $app->request();
        if (!$dbHandler->checkAuth($request->params('key'))) {
            $app->response()->status(403);
        } else {
            $fields = (isset($fields) ? explode(",", $fields) : null);
            $app->response()->write($dbHandler->doInsert($fields, $table, $request->post()));
        }
    }
);

$app->put(
    '/:table/:fields',
    function ($table, $fields) use ($dbHandler, $app) {
        if (!$dbHandler->checkAuth($app->request()->params('key'))) {
            $app->response()->status(403);
        } else {
            $where = $app->request()->params('where');
            $app->response()->write($dbHandler->doUpdate($fields, $table, $app->request()->put(), $where));
        }
    }
);

// start Slim app
$app->run();
