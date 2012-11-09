<?php
namespace Webservice\Bug;

use Webservice\Database\AbstractDbHandler;
use Helper\PostGisSqlHelper;

class BugHandler extends AbstractDbHandler
{
    public function getBugsById($schema, $id)
    {
        //refactor to generic validate method
        if (is_numeric($schema) && is_numeric($id)) {
            $result = $this->db->doSelectQuery('schema = \'' . $schema . '\' and id = ' . $id);

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
        $result = $this->db->doSelectQuery("1=1", $orderBy, $limit);
        return json_encode($result);
    }
}
