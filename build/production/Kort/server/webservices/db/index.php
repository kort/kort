<?php
/**
 * kort - the /db webservices
 */

/** Load Slim library */
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
/** Load ClassLoader */
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
            $fields = (isset($fields) ? explode(",", $fields) : array("*"));
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
            return;
        }

        $fields = (isset($fields) ? explode(",", $fields) : null);
        $returnFields = $request->params('return');
        $returnFields = $returnFields ? explode(",", $returnFields) : $fields;

        $app->response()->write($dbHandler->doInsert($fields, $table, $request->post(), $returnFields));
    }
);

$app->put(
    '/:table/:fields',
    function ($table, $fields) use ($dbHandler, $app) {
        $request = $app->request();
        if (!$dbHandler->checkAuth($request->params('key'))) {
            $app->response()->status(403);
        } else {
            $fields = (isset($fields) ? explode(",", $fields) : null);
            $returnFields = $request->params('return');
            $returnFields = $returnFields ? explode(",", $returnFields) : $fields;
            $where = $request->params('where');
            $app->response()->write($dbHandler->doUpdate($fields, $table, $request->put(), $where, $returnFields));
        }
    }
);

$app->post(
    '/transaction',
    function () use ($dbHandler, $app) {
        $request = $app->request();
        if (!$dbHandler->checkAuth($request->params('key'))) {
            $app->response()->status(403);
            return;
        }

        $statements = json_decode($request->getBody(), true);
        $dbResult = $dbHandler->doTransaction($statements);
        if (!$dbResult) {
            $request->status(404);
            return;
        }
        $app->response()->write($dbResult);
    }
);


if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
