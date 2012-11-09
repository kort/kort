<?php
namespace Webservice\Bug;

use Webservice\Database\AbstractDbHandler;
use Helper\PostGisSqlHelper;

class BugHandler extends AbstractDbHandler
{
    protected $bugTable = 'kort.errors';
    protected $bugFields = array(
        'id',
        'schema',
        'type',
        'osm_id',
        'osm_type',
        'title',
        'description',
        'latitude',
        'longitude'
    );

    public function getBugsByOwnPosition($lat, $lng, $limit, $radius)
    {
        $where = "ST_Within(geom,ST_Buffer(" . PostGisSqlHelper::getLatLngGeom($lat, $lng) . "," . $radius . "))";
        $orderBy = "ST_Distance(geom," . PostGisSqlHelper::getLatLngGeom($lat, $lng) . ")";
        $result = $this->db->doSelectQuery($this->bugFields, $this->bugTable, $where, $orderBy, $limit);
        return json_encode($result);
    }
}
