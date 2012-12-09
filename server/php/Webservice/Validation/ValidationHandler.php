<?php
/**
 * kort - Webservice\Validation\ValidationHandler class
 */
namespace Webservice\Validation;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

/**
 * The ValidationHandler class handles requests to the validation webservice.
 */
class ValidationHandler extends DbProxyHandler
{
    /**
     * Returns the database table to be used with this Handler.
     *
     * @return the database table as a string.
     */
    protected function getTable()
    {
        return 'kort.validations';
    }

    /**
     * Returns the database fields to be used with this Handler.
     *
     * @return an array of database fields
     */
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

    /**
     * Return the validations around the users current position.
     *
     * @param float   $lat    User positions latitude.
     * @param float   $lng    User positions longitude.
     * @param integer $limit  Amount of validations to return.
     * @param integer $radius Radius around the user position to look for validations.
     *
     * @return string JSON-encoded validations around the users current position
     */
    public function getValidationsByOwnPosition($lat, $lng, $limit, $radius)
    {
        $limit = empty($limit) ? 20 : $limit;
        $radius = empty($radius) ? 5000 : $radius;
        //TODO: Use the radius and get a fast result
        // $this->getDbProxy()->setWhere("ST_DWithin(geom," . $userPosition . "," . $radius . ")");

        $where  = "fix_user_id != " . $_SESSION['user_id'];
        $where .= " AND not exists ";
        $where .= " (select 1 from kort.validation val ";
        $where .= " where val.fix_id = id and val.user_id = " . $_SESSION['user_id'] . ")";
        $this->getDbProxy()->setWhere($where);

        $this->getDbProxy()->setOrderBy("geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng));
        $this->getDbProxy()->setLimit($limit);

        return $this->getDbProxy()->select();
    }
}
