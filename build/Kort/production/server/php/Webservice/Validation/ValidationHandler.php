<?php
namespace Webservice\Validation;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

class ValidationHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.validations';
    }

    protected function getFields()
    {
        return array(
            'id',
            'type',
            'osm_id',
            'osm_type',
            'title',
            'fixmessage',
            'question',
            'latitude',
            'longitude',
            'upratings',
            'downratings',
            'required_validations'
        );
    }

    public function getValidationsByOwnPosition($lat, $lng, $limit, $radius)
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
