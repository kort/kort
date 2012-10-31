<?php
namespace Webservice\Bug;

use Webservice\Database\AbstractDbHandler;

class BugHandler extends AbstractDbHandler
{
    public function bugsIdRouteHandler($res)
    {
        $handler = $this;
        return function ($schema, $id) use ($handler, $res) {
            $res->write($handler->getBugsById($schema, $id));
        };
    }

    public function bugsBoundsHandler($res)
    {
        $handler = $this;
        return function ($northEastLat, $northEastLng, $southWestLat, $southWestLng) use ($handler, $res) {
            $res->write($handler->getBugsByBounds($northEastLat, $northEastLng, $southWestLat, $southWestLng));
        };
    }

    public function getBugsById($schema, $id)
    {
        //refactor to generic validate method
        if (is_numeric($schema) && is_numeric($id)) {
            $result = $this->db->doSelectQuery('schema = \'' . $schema . '\' AND error_id = ' . $id);

            // only return first row (error_id not unique)
            if (count($result) > 0) {
                return json_encode($result[0]);
            }
        }
        return "";
    }

    public function getBugsByBounds($northEastLat, $northEastLng, $southWestLat, $southWestLng)
    {
        $northEastLat = $this->convertLatLngValue($northEastLat);
        $southWestLat = $this->convertLatLngValue($southWestLat);
        $northEastLng = $this->convertLatLngValue($northEastLng);
        $southWestLng = $this->convertLatLngValue($southWestLng);

        $where  = 'lat BETWEEN ' . $southWestLat . ' AND ' . $northEastLat;
        $where .= ' AND lon BETWEEN ' . $southWestLng . ' AND ' . $northEastLng;
        $result = $this->db->doSelectQuery($where);

        return json_encode($result);
    }

    private function convertLatLngValue($value)
    {
        return round($value * 10000000);
    }
}
