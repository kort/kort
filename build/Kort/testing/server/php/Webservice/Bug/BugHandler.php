<?php
namespace Webservice\Bug;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

class BugHandler extends DbProxyHandler
{
    protected $table = 'kort.errors';
    protected $fields = array(
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
<<<<<<< HEAD
        // $where = "ST_DWithin(geom," . PostGisSqlHelper::getLatLngGeom($lat, $lng) . "," . $radius . ")";
        $where = "";
        $orderBy = "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $result = $this->db->doSelectQuery($this->bugFields, $this->bugTable, $where, $orderBy, $limit);
        return json_encode($result);
    }
=======
        // $this->dbProxy->setWhere("ST_DWithin(geom," . PostGisSqlHelper::getLatLngGeom($lat, $lng) . "," . $radius . ")");
        $this->getDbProxy()->setOrderBy("geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng));
        $this->getDbProxy()->setLimit($limit);
>>>>>>> Updated testing build

        return $this->getDbProxy()->getFromDb();
    }
}
