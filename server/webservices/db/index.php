<?php
require_once('../../../lib/Slim-2.1.0/Slim/Slim.php');
require_once('../../../server/php/ClassLoader.php');

// Load Slim library
\Slim\Slim::registerAutoloader();
Kort\ClassLoader::registerAutoLoader();


$app = new \Slim\Slim();
$res = $app->response();

$dbHandler = new \Webservice\Database\DbHandler();

// define REST resources
$app->get(
    '/:table(/:fields)',
    function ($table, $fields=null) use ($dbHandler, $res) {
        $fields = (isset($fields) ? explode(",", $fields) : null);
        $where = (isset($_GET['where']) ? $_GET['where'] : null);
        $orderBy = (isset($_GET['orderby']) ? $_GET['orderby'] : null);
        $limit = (isset($_GET['limit']) ? $_GET['limit'] : null);

        $res->write($dbHandler->doSelect($fields, $table, $where, $orderBy, $limit));
    }
);

$app->post(
    '/:table/:fields',
    function ($table, $fields) use ($dbHandler, $app) {
        $dbHandler->doInsert($fields, $table, $app->request()->post());
    }
);

// start Slim app
$app->run();
