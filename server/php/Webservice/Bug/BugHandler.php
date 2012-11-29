<?php
namespace Webservice\Bug;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

class BugHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.errors';
    }

    protected function getFields()
    {
        return array(
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
    }

    public function getBugsByOwnPosition($lat, $lng, $limit, $radius)
    {
        $limit = empty($limit) ? 20 : $limit;
        $radius = empty($radius) ? 5000 : $radius;
        //TODO: Use the radius and get a fast result
        // $userPosition =  PostGisSqlHelper::getLatLngGeom($lat, $lng);
        // $this->dbProxy->setWhere("ST_DWithin(geom," . $userPosition . "," . $radius . ")");
        $this->getDbProxy()->setOrderBy("geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng));
        $this->getDbProxy()->setLimit($limit);

        return $this->getDbProxy()->select();
    }
}
