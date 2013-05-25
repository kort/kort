<?php
/**
 * kort - Webservice\Bug\BugHandler class
 */
namespace Webservice\Bug;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;
use Webservice\TransactionDbProxy;

/**
 * The BugHandler class is used to handle request to the bug webservices.
 */
class BugHandler extends DbProxyHandler
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
     * Returns the table used by this handler.
     */
    protected function getTable()
    {
        //please see query for more details
        //return 'kort.errors e';
    }

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        //please see query for more details

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
            'answer_placeholder',
            'fix_koin_count',
            'geom',
            'txt1',
            'txt2',
            'txt3',
            'txt4',
            'txt5'
        );

    }

    /**
     * Returns bugs around the users position.
     *
     * @param float   $lat    Latitide of the user position.
     * @param float   $lng    Longitude of the user position.
     * @param integer $limit  Amount of bugs to return.
     * @param integer $radius Radius around the users psotion to look for.
     *
     * @return string JSON-formatted bugs
     */
    public function getBugsByOwnPosition($lat, $lng, $limit, $radius)
    {
        $limit = empty($limit) ? 20 : $limit;
        $radius = empty($radius) ? 5000 : $radius;
        $userPosition =  PostGisSqlHelper::getLatLngGeom($lat, $lng);

        /*
        $sql  = "select * from (";
        $sql .= "select " . implode($this->getFields(), ',');
        $sql .= " from " . $this->getTable();
        $sql .= " order by " . "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $sql .= " limit " . $limit;
        $sql .= ") t";
        $sql .= " where " . "ST_Distance_Sphere(t.geom," . $userPosition . ") <= " . $radius;
        */

        //aggregation1 : join promotion with promo2error_type
        $sql  = "WITH aggregation1 AS (";
        $sql .= "SELECT p.id AS promo_id, p.startdate, p.enddate, p.geom AS promogeom, pm.error_type, pm.mission_extra_coins AS extra_coins FROM kort.promotion p INNER JOIN kort.promo2mission pm ON p.id=pm.promo_id WHERE p.startdate < now() AND p.enddate > now())";
        //aggregation2: get limited missions around the user's position as before
        $sql .= ", aggregation2 AS (";
        $sql .= "SELECT * FROM (";
        $sql .= "SELECT id AS missionid, schema, type, osm_id, osm_type, title, description, latitude, longitude, view_type, answer_placeholder, fix_koin_count, geom AS missiongeom, txt1, txt2, txt3, txt4, txt5 FROM kort.errors";
        $sql .= " ORDER BY " . "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $sql .= " LIMIT " . $limit;
        $sql .= ") t";
        $sql .= " WHERE " . "ST_Distance_Sphere(missiongeom," . $userPosition . ") <= " . $radius ." )";
        //aggregation3: join aggregation2 and aggregation1 and check where mission_geom is within promotion_geom. As result, we get
        //all the missions around the user's position who actualy belongs to a active promotion
        $sql .= ", aggregation3 AS (";
        $sql .= "SELECT ag2.missionid AS missionidtemp, ag2.schema AS schematemp, ag1.promo_id, ag1.extra_coins FROM aggregation2 ag2 INNER JOIN aggregation1 ag1 ON ag2.type=ag1.error_type WHERE ST_WITHIN(ag2.missiongeom, ag1.promogeom))";
        //left join the missions around the user (aggregation2) with the subset of the missions who belongs to a promotion (aggregation3) => the fields promo_id and extra_coins is either null or holds the corresponding promotion values
        $sql .= "SELECT missionid AS id,schema,type,osm_id,osm_type,title,description,latitude,longitude,view_type,answer_placeholder,fix_koin_count,missiongeom AS geom,txt1,txt2,txt3,txt4,txt5,promo_id,extra_coins FROM aggregation2 ag2 LEFT JOIN aggregation3 ag3 ON ((ag2.missionid=ag3.missionidtemp) AND (ag2.schema=ag3.schematemp))";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        $position = $this->getDbProxy()->addToTransaction($params);
        $result = json_decode($this->getDbProxy()->sendTransaction(), true);
        $translatedData = array_map(array($this, "translateBug"), $result[$position - 1]);
        return json_encode($translatedData);
    }

    /**
     * Returns the selected bugs.
     *
     * @return string JSON-encoded bugs
     */
    protected function select()
    {
        $data = json_decode($this->getDbProxy()->select(), true);
        $data = array_map(array($this, "translateBug"), $data);
        return json_encode($data);
    }

    /**
     * Return a bug with a specific id.
     *
     * @param integer $id     The id of the error.
     * @param string  $schema The schema this error belongs to.
     * @param integer $osmId  The id of the OSM object.
     *
     * @return string JSON-encoded bug
     */
    public function getById($id, $schema, $osmId)
    {
        $where  = "id = " . $id;
        $where .= " and schema = '" . $schema . "'";
        $where .= " and osm_id = " . $osmId;
        $this->getDbProxy()->setWhere($where);
        return $this->select();
    }

    /**
     * Translate all texts of a bug.
     *
     * @param array $bug The bug to translate.
     *
     * @return array the translated bug
     */
    public function translateBug(array $bug)
    {
        $bug['title'] = $this->translate($bug['title']);
        $bug['answer_placeholder'] = $this->translate($bug['answer_placeholder']);
        $bug['description'] = $this->translate($bug['description']);
        $bug['description'] = $this->translateAndReplacePlaceholder($bug, $bug['description']);

        return $bug;
    }
}
