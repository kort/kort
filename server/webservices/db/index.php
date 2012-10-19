<?php
require_once('dbConfig.php');
require_once('PsqlHelper.php');
require('../../lib/Slim-2.1.0/Slim/Slim.php');

// Load Slim library
\Slim\Slim::registerAutoloader();

// create Slim app
$app = new \Slim\Slim();


// define REST resources
$app->get('/', 'rootRouteHandler');
$app->get('/bugs/:id', 'bugsIdRouteHandler');
$app->get('/bugs/bounds/:northeastlat,:northeastlng/:southwestlat,:southwestlng', 'bugsBoundsRouteHandler');

function rootRouteHandler() {
    echo "You're on the rooooot";
}

function bugsIdRouteHandler($id) {
    $dbConfig = new PsqlDbConfig();
    $psqlHelper = new PsqlHelper($dbConfig);
    $result = $psqlHelper->doSelectQuery('error_id = '.$id);
    
    // only return first row (error_id not unique)
    echo json_encode($result[0]);
    $psqlHelper->close();
}

function bugsBoundsRouteHandler($northEastLat, $northEastLng, $southWestLat, $southWestLng) {
    $dbConfig = new PsqlDbConfig();
    $psqlHelper = new PsqlHelper($dbConfig);
    
    $where = 'lat < '.$northEastLat.' AND lat > '.$southWestLat. ' AND lon < '.$northEastLng.' AND lon > '.$southWestLng;
    $result = $psqlHelper->doSelectQuery($where);
    
    echo json_encode($result);
    $psqlHelper->close();
}

// start Slim app
$app->run();
?>
