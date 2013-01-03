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
            'falsepositive',
            'question',
            'latitude',
            'longitude',
            'upratings',
            'downratings',
            'required_votes',
            'geom'
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
        $validation['question'] = $this->translate($validation['question']);
        $validation['title'] = $this->translate($validation['title']);

        return $validation;
    }
}
