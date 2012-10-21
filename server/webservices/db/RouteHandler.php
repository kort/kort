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
        $this->db->close();
    }

    public function bugsBoundsRouteHandler($northEastLat, $northEastLng, $southWestLat, $southWestLng)
    {
        $northEastLat = convertLatLngValue($northEastLat);
        $southWestLat = convertLatLngValue($southWestLat);
        $northEastLng = convertLatLngValue($northEastLng);
        $southWestLng = convertLatLngValue($southWestLng);

        $where  = 'lat < ' . $northEastLat;
        $where .= ' AND lat > ' . $southWestLat;
        $where .= ' AND lon < ' . $northEastLng;
        $where .= ' AND lon > ' . $southWestLng;
        $result = $this->db->doSelectQuery($where);

        echo json_encode($result);
        $this->db->close();
    }

    public function fixesRouteHandler($postVariables)
    {
        // TODO write fix to database
        echo "writing fix to database<br />";
        var_dump($postVariables);
    }

    private function convertLatLngValue($value)
    {
        return round($value * 10000000);
    }
}
