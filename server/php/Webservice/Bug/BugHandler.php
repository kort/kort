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

    public function getBugsByOwnPosition($lat, $lng, $limit)
    {
        $where = "ST_Within(geom,ST_Buffer(".PostGisSqlHelper::getLatLngGeom($lat, $lng).",1000))";
        $orderBy = "ST_Distance(".PostGisSqlHelper::getLatLngGeom($lat, $lng).",geom)";
        $result = $this->db->doSelectQuery($this->bugFields, $this->bugTable, $where, $orderBy, $limit);
        return json_encode($result);
    }
}
