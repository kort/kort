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
            'view_type',
            'fix_user_id',
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
        // $this->getDbProxy()->setWhere("ST_DWithin(geom," . $userPosition . "," . $radius . ")");

        $where  = "fix_user_id != " . $_SESSION['user_id'];
        $where .= " AND not exists (select 1 from kort.validation val where val.fix_id = id and val.user_id = " . $_SESSION['user_id'] . ")";
        $this->getDbProxy()->setWhere($where);
        
        $this->getDbProxy()->setOrderBy("geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng));
        $this->getDbProxy()->setLimit($limit);

        return $this->getDbProxy()->select();
    }
}
