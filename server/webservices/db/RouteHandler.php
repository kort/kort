<?php
namespace Kort\Webservice;

use Kort\Webservice\PsqlHelper;
use Kort\Webservice\DbConfig;

class RouteHandler
{
    protected $db;

    public static function autoload($className)
    {
        $className = str_replace(__NAMESPACE__.'\\', '', $className);
        require_once($className.".php");
    }

    public function __construct()
    {
        spl_autoload_register(__NAMESPACE__ . "\\RouteHandler::autoload");
        $this->db = new PsqlHelper(new DbConfig());
    }
    
    public function rootRouteHandler()
    {
        echo "You're on the rooooot";
    }

    public function bugsIdRouteHandler($schema, $id)
    {
        $result = $this->db->doSelectQuery('schema = \'' . $schema . '\' AND error_id = ' . $id);

        // only return first row (error_id not unique)
        if (count($result) > 0) {
            echo json_encode($result[0]);
        }
    }

    public function bugsBoundsRouteHandler($northEastLat, $northEastLng, $southWestLat, $southWestLng)
    {
        $northEastLat = $this->convertLatLngValue($northEastLat);
        $southWestLat = $this->convertLatLngValue($southWestLat);
        $northEastLng = $this->convertLatLngValue($northEastLng);
        $southWestLng = $this->convertLatLngValue($southWestLng);

        $where  = 'lat BETWEEN ' . $southWestLat . ' AND ' . $northEastLat;
        $where .= ' AND lon BETWEEN ' . $southWestLng . ' AND ' . $northEastLng;
        $result = $this->db->doSelectQuery($where);

        echo json_encode($result);
    }

    public function fixesRouteHandler($postVariables)
    {
        unset($postVariables['id']);
        $this->db->doInsertQuery($postVariables);
    }

    private function convertLatLngValue($value)
    {
        return round($value * 10000000);
    }
}
