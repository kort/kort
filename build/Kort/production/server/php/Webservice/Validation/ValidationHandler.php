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
     */
    protected function getTable()
    {
        //not used. please see query for more details.
        //return 'kort.validations';
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

        /*
        $where  = "fix_user_id != " . $_SESSION['user_id'];
        $where .= " AND not exists ";
        $where .= " (select 1 from kort.vote v ";
        $where .= " where v.fix_id = id and v.user_id = " . $_SESSION['user_id'] . ")";

        $sql  = "select * from (";
        $sql .= "select " . implode($this->getFields(), ',');
        $sql .= " from " . $this->getTable();
        $sql .= " where " . $where;
        $sql .= " order by " . "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $sql .= " limit " . $limit;
        $sql .= ") t";
        $sql .= " where " . "ST_Distance_Sphere(t.geom," . $userPosition . ") <= " . $radius;
        */

        //aggregation1 : join promotion with promo2error_type
        $sql  = "WITH aggregation1 AS (";
        $sql .= "SELECT p.id AS promo_id, p.startdate, p.enddate, p.geom AS promogeom, pm.error_type, pm.validation_extra_coins AS extra_coins FROM kort.promotion p INNER JOIN kort.promo2mission pm ON p.id=pm.promo_id WHERE p.startdate < now() AND p.enddate > now())";
        //aggregation2: get limited validations around the user's position as before
        $sql .= ", aggregation2 AS (";
        $sql .= "select * from (";
        $sql .= "select id AS validationid,type,view_type,fix_user_id,osm_id,osm_type,title,fixmessage,falsepositive,question,bug_question,vote_koin_count,latitude,longitude,upratings,downratings,required_votes,geom AS validationgeom,txt1,txt2,txt3,txt4,txt5";
        $sql .= " from kort.validations";
        $sql .= " where fix_user_id != " . $_SESSION['user_id'] . " AND not exists (select 1 from kort.vote v where v.fix_id = id and v.user_id = " . $_SESSION['user_id'] . ")";
        $sql .= " order by " . "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $sql .= " limit " . $limit;
        $sql .= ") t";
        $sql .= " where " . "ST_Distance_Sphere(validationgeom," . $userPosition . ") <= " . $radius . " )";
        //aggregation3: join aggregation2 and aggregation1 and check where validation_geom is within promotion_geom. As result, we get
        //all the validations around the user's position who actualy belongs to a active promotion
        $sql .= ", aggregation3 AS (";
        $sql .= "SELECT ag2.validationid AS validationidtemp, ag1.promo_id, ag1.extra_coins FROM aggregation2 ag2 INNER JOIN aggregation1 ag1 ON ag2.type=ag1.error_type WHERE ST_WITHIN(ag2.validationgeom, ag1.promogeom))";
        //left join the validations around the user (aggregation2) with the subset of the validations who belongs to a promotion (aggregation3) => the fields promo_id and extra_coins is either null or holds the corresponding promotion values
        $sql .= "SELECT validationid AS id,type,view_type,fix_user_id,osm_id,osm_type,title,fixmessage,falsepositive,question,bug_question,vote_koin_count,latitude,longitude,upratings,downratings,required_votes,validationgeom AS geom,txt1,txt2,txt3,txt4,txt5,promo_id,extra_coins FROM aggregation2 ag2 LEFT JOIN aggregation3 ag3 ON ag2.validationid=ag3.validationidtemp";

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
