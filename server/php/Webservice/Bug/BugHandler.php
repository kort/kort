<?php
namespace Webservice\Bug;

use Webservice\Database\AbstractDbHandler;
use Helper\PostGisSqlHelper;

class BugHandler extends AbstractDbHandler
{
    public function bugsIdRouteHandler($res)
    {
        $handler = $this;
        return function ($schema, $id) use ($handler, $res) {
            $res->write($handler->getBugsById($schema, $id));
        };
    }


    public function getBugsById($schema, $id)
    {
        //refactor to generic validate method
        if (is_numeric($schema) && is_numeric($id)) {
            $result = $this->db->doSelectQuery('schema = \'' . $schema . '\' AND id = ' . $id);

            // only return first row (error_id not unique)
            if (count($result) > 0) {
                return json_encode($result[0]);
            }
        }
        return "";
    }

    public function getBugsByOwnPosition($lat, $lng, $limit)
    {
        $orderBy = "ST_Distance(".PostGisSqlHelper::getLatLngGeom($lat, $lng).",geom)";
        $result = $this->db->doSelectQuery("1=1",$orderBy,$limit);

        return json_encode($result);
    }
}
