<?php
namespace Webservice\Bug;

use Webservice\Database\AbstractDbHandler;
use Helper\PostGisSqlHelper;

class BugHandler extends DbHandler
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
        'longitude',
        'view_type',
        'answer_placeholder'
    );

    public function getBugsByOwnPosition($lat, $lng, $limit, $radius)
    {
        //TODO: Use the radius and get a fast result
        // $where = "ST_DWithin(geom," . PostGisSqlHelper::getLatLngGeom($lat, $lng) . "," . $radius . ")";
        $where = "";
        $orderBy = "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $result = $this->db->doSelectQuery($this->bugFields, $this->bugTable, $where, $orderBy, $limit);
        return json_encode($result);
    }

    public function getTracktypes()
    {
        $fields = array('id', 'type_key', 'title', 'sorting');
        $table = 'kort.tracktype';
        $where = '';
        $orderBy = 'sorting';
        $limit = '';
        $result = $this->db->doSelectQuery($fields, $table, $where, $orderBy, $limit);
        return json_encode($result);
    }
}
