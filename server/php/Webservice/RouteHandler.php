<?php
namespace Webservice;

use Webservice\PsqlHelper;
use Webservice\DbConfig;

class RouteHandler
{
    protected $db;

    public function __construct()
    {
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
