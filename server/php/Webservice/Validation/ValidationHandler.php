<?php
/**
 * kort - Webservice\Validation\ValidationHandler class
 */
namespace Webservice\Validation;

use Webservice\DbProxyHandler;
use Webservice\TransactionDbProxy;
use Helper\PostGisSqlHelper;

/**
 * The ValidationHandler class handles requests to the validation webservice.
 */
class ValidationHandler extends DbProxyHandler
{
    /**
     * Initialized the BugHandler object.
     *
     * @param TransactionDbProxy $dbProxy The database proxy object.
     */
    public function __construct(TransactionDbProxy $dbProxy = null)
    {
        parent::__construct();
        if (empty($dbProxy)) {
            $this->setDbProxy(new TransactionDbProxy());
        } else {
            $this->setDbProxy($dbProxy);
        }
    }

    /**
     * Returns the database table to be used with this Handler.
     *
     * @return string the table name used by this handler
     */
    protected function getTable()
    {
        //not used. please see query for more details.
        return '';
    }

    /**
     * Returns the database fields to be used with this Handler.
     *
     * @return an array of database fields
     */
    protected function getFields()
    {
        //not used. please see query for more details.
        return array(
            'validationid AS id',
            'id',
            'type',
            'view_type',
            'fix_user_id',
            'osm_id',
            'osm_type',
            'title',
            'fixmessage',
            'falsepositive',
            'question',
            'bug_question',
            'latitude',
            'longitude',
            'upratings',
            'downratings',
            'required_votes',
            'geom',
            'txt1',
            'txt2',
            'txt3',
            'txt4',
            'txt5'
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
        $userPosition =  PostGisSqlHelper::getLatLngGeom($lat, $lng);

        //aggregation1 : join promotion with promo2error_type
        $sql  = "WITH aggregation1 AS (";
        $sql .= "SELECT p.id AS promo_id, ";
        $sql .= "       p.startdate, ";
        $sql .= "       p.enddate, ";
        $sql .= "       p.geom AS promogeom, ";
        $sql .= "       pm.error_type, ";
        $sql .= "       pm.validation_extra_coins AS extra_coins ";
        $sql .= "FROM kort.promotion p ";
        $sql .= "INNER JOIN kort.promo2mission pm ON p.id=pm.promo_id ";
        $sql .= "WHERE p.startdate < now() AND p.enddate > now())";
        //aggregation2: get limited validations around the user's position as before
        $sql .= ", aggregation2 AS (";
        $sql .= "select * from (";
        $sql .= "select id AS validationid, ";
        $sql .= "       type, ";
        $sql .= "       view_type,";
        $sql .= "       fix_user_id, ";
        $sql .= "       osm_id, ";
        $sql .= "       osm_type, ";
        $sql .= "       title, ";
        $sql .= "       fixmessage, ";
        $sql .= "       falsepositive, ";
        $sql .= "       question, ";
        $sql .= "       bug_question, ";
        $sql .= "       vote_koin_count, ";
        $sql .= "       latitude, ";
        $sql .= "       longitude, ";
        $sql .= "       upratings, ";
        $sql .= "       downratings, ";
        $sql .= "       required_votes,geom AS validationgeom,";
        $sql .= "       txt1, ";
        $sql .= "       txt2, ";
        $sql .= "       txt3, ";
        $sql .= "       txt4, ";
        $sql .= "       txt5 ";
        $sql .= " from kort.validations";
        $sql .= " where fix_user_id != " . $_SESSION['user_id'] . " ";
        $sql .= " AND not exists (select 1 ";
        $sql .= "                 from kort.vote v ";
        $sql .= "                 where v.fix_id = id ";
        $sql .= "                 and v.user_id = " . $_SESSION['user_id'] . ")";
        $sql .= " order by " . "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $sql .= " limit " . $limit;
        $sql .= ") t";
        $sql .= " where " . "ST_Distance_Sphere(validationgeom," . $userPosition . ") <= " . $radius . " )";
        //aggregation3: join aggregation2 and aggregation1 and check where validation_geom is within promotion_geom.
        //As result, we get all the validations around the user's position who actualy belongs to a active promotion
        $sql .= ", aggregation3 AS (";
        $sql .= "SELECT ag2.validationid AS validationidtemp, ";
        $sql .= "       ag1.promo_id, ";
        $sql .= "       ag1.extra_coins ";
        $sql .= "FROM aggregation2 ag2 ";
        $sql .= "INNER JOIN aggregation1 ag1 ON ag2.type=ag1.error_type ";
        $sql .= "WHERE ST_WITHIN(ag2.validationgeom, ag1.promogeom))";
        //left join the validations around the user (aggregation2) with the subset of the validations
        //who belongs to a promotion (aggregation3)
        //=> the fields promo_id and extra_coins is either null or holds the corresponding promotion values
        $sql .= "SELECT validationid AS id,";
        $sql .= "       type, ";
        $sql .= "       view_type, ";
        $sql .= "       fix_user_id, ";
        $sql .= "       osm_id, ";
        $sql .= "       osm_type, ";
        $sql .= "       title, ";
        $sql .= "       fixmessage, ";
        $sql .= "       falsepositive, ";
        $sql .= "       question, ";
        $sql .= "       bug_question, ";
        $sql .= "       vote_koin_count, ";
        $sql .= "       latitude, ";
        $sql .= "       longitude, ";
        $sql .= "       upratings, ";
        $sql .= "       downratings, ";
        $sql .= "       required_votes, ";
        $sql .= "       validationgeom AS geom, ";
        $sql .= "       txt1, ";
        $sql .= "       txt2, ";
        $sql .= "       txt3, ";
        $sql .= "       txt4, ";
        $sql .= "       txt5, ";
        $sql .= "       promo_id, ";
        $sql .= "       extra_coins ";
        $sql .= "FROM aggregation2 ag2 ";
        $sql .= "LEFT JOIN aggregation3 ag3 ON ag2.validationid=ag3.validationidtemp";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        $position = $this->getDbProxy()->addToTransaction($params);
        $result = json_decode($this->getDbProxy()->sendTransaction(), true);
        $validationData = array_map(array($this, "convertBoolean"), $result[$position - 1]);
        $validationData = array_map(array($this, "translateValidation"), $validationData);

        return json_encode($validationData);
    }

    /**
     * Converts the string values from the database to "real" boolean values.
     *
     * @param array $validation The validation data.
     *
     * @return array the $validation data with fixed boolean values
     */
    public function convertBoolean(array $validation)
    {
        $validation['falsepositive'] = ($validation['falsepositive'] == 't') ? true : false;
        return $validation;
    }

    /**
     * Translate all texts of a validation.
     *
     * @param array $validation The validation to translate.
     *
     * @return array the translated validation
     */
    public function translateValidation(array $validation)
    {
        $validation['title'] = $this->translate($validation['title']);
        $validation['question'] = $this->translate($validation['question']);
        $validation['question'] = $this->translateAndReplacePlaceholder($validation, $validation['question']);
        $validation['bug_question'] = $this->translate($validation['bug_question']);
        $validation['bug_question'] = $this->translateAndReplacePlaceholder($validation, $validation['bug_question']);

        return $validation;
    }
}
