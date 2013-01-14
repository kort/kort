<?php
/**
 * kort - the /statistics webservices
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

$statisticsHandler = new \Webservice\Statistics\StatisticsHandler();

$app->get(
    '/',
    function () use ($statisticsHandler, $app, $slim) {
        $statistics = $statisticsHandler->getStatistics();
        
        if (json_decode($statistics, true) === null) {
            $statisticData["fix_count"] = 3145;
            $statisticData["falsepositive_fix_count"] = 250;
            $statisticData["complete_fix_count"] = 53;
            $statisticData["validated_fix_count"] = 42;
            $statisticData["user_count"] = 507;
            $statisticData["active_user_count"] = 207;
            $statisticData["osm_user_count"] = 388;
            $statisticData["google_user_count"] = 114;
            $statisticData["vote_count"] = 560;
            $statisticData["valid_vote_count"] = 488;
            $statisticData["invalid_vote_count"] = 72;
            $statisticData["badge_count"] = 398;
            $statisticData["first_place_badge_count"] = 12;
            $statisticData["second_place_badge_count"] = 11;
            $statisticData["third_place_badge_count"] = 13;
            $statisticData["hundred_missions_badge_count"] = 8;
            $statisticData["fifty_missions_badge_count"] = 12;
            $statisticData["ten_missions_badge_count"] = 71;
            $statisticData["thousand_checks_badge_count"] = 0;
            $statisticData["hundred_checks_badge_count"] = 1;
            $statisticData["ten_checks_badge_count"] = 16;
            $statisticData["first_mission_badge_count"] = 205;
            $statisticData["first_check_badge_count"] = 49;
            
            $statistics = json_encode(array($statisticData));
        }
        
        $callback = $app->request()->params('callback');
        if (empty($callback)) {
            $slim->returnData($statistics);
        } else {
            // generate JSONP return value
            if (empty($statistics)) {
                $statistics = '[]';
            }
            $app->response()->header('Content-Type', 'application/x-javascript');
            $app->response()->write($callback . "({\"return\":". $statistics . "});");
        }
    }
);

if (!isset($_SESSION)) {
    session_cache_limiter(false);
    session_start();
}

// start Slim app
$app->run();
