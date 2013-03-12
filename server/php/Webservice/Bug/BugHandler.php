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
     *
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.errors';
    }

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
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
            'answer_placeholder',
            'fix_koin_count',
            'geom',
            'txt1',
            'txt2',
            'txt3',
            'txt4',
            'txt5',
            /*
            'campaignId',
            'campaignExtraCoins'
            */
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

        $sql  = "select * from (";
        $sql .= "select " . implode($this->getFields(), ',');
        $sql .= " from " . $this->getTable();
        $sql .= " order by " . "geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng);
        $sql .= " limit " . $limit;
        $sql .= ") t";
        $sql .= " where " . "ST_Distance_Sphere(t.geom," . $userPosition . ") <= " . $radius;

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";


        /*
         * For frontend development purpose, use returnDummyBugArray method to create
         * a demo bug. This bug is located right at your current position. For live version, uncomment
         * all following lines and comment the returnDummyBugArray-Line.
         */

        //$position = $this->getDbProxy()->addToTransaction($params);
        //$result = json_decode($this->getDbProxy()->sendTransaction(), true);
        //$translatedData = array_map(array($this, "translateBug"), $result[$position - 1]);
        $translatedData = $this->returnDummyBugArray($lat,$lng);
        return json_encode($translatedData);
    }

    protected function returnDummyBugArray($lat, $lng) {


        $toReturnArray = array(array(
            "id" => "333",
            "schema" => "95",
            "type" => "missing_track_type",
            "osm_id" => "333",
            "osm_type" => "way",
            "title" => "Dummy data track unknown",
            "description" => "What kind of track is this?",
            "latitude" => $lat,
            "longitude" => $lng,
            "view_type" => "select",
            "answer_placeholder" => "Type",
            "fix_koin_count" => "5",
            "geom" => "0101000020E61000000A21318B9A2521408723FE17BEAC4740",
            "txt1" => "",
            "txt2" => "",
            "txt3" => "",
            "txt4" => "",
            "txt5" => "",
           )
        );

        return $toReturnArray;
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
