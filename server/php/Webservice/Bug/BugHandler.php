<?php
/**
 * kort - Webservice\Bug\BugHandler class
 */
namespace Webservice\Bug;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

/**
 * The BugHandler class is used to handle request to the bug webservices
 */
class BugHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.errors';
    }

    /**
     * Returns the table fields used by this handler.
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
            'txt1',
            'txt2',
            'txt3',
            'txt4',
            'txt5'
        );
    }

    /**
     * Returns bugs around the users position
     * @param float $lat latitide of the user position
     * @param floar $lng longitude of the user position
     * @param int $limit amount of bugs to return
     * @param int $radius the radius around the users psotion to look for
     * @return string JSON-formatted bugs
     */
    public function getBugsByOwnPosition($lat, $lng, $limit, $radius)
    {
        $limit = empty($limit) ? 20 : $limit;
        $radius = empty($radius) ? 5000 : $radius;
        //TODO: Use the radius and get a fast result
        // $userPosition =  PostGisSqlHelper::getLatLngGeom($lat, $lng);
        // $this->dbProxy->setWhere("ST_DWithin(geom," . $userPosition . "," . $radius . ")");
        $this->getDbProxy()->setOrderBy("geom <-> " . PostGisSqlHelper::getLatLngGeom($lat, $lng));
        $this->getDbProxy()->setLimit($limit);

        return $this->select();
    }

    /**
     * Returns the selected bugs
     * @return string JSON-encoded bugs
     */
    protected function select()
    {
        $data = json_decode($this->getDbProxy()->select(), true);
        $data = array_map(array($this, "translateBug"), $data);
        return json_encode($data);
    }

    /**
     * Return a bug with a specific id
     * @param int $id the id of the bug
     * @return string JSON-encoded bug
     */
    public function getById($id)
    {
        $this->getDbProxy()->setWhere("id = " . $id);
        return $this->select();
    }

    /**
     * Translate all texts of a bug
     * @param array $bug the bug to translate
     * @return array the translated bug
     */
    public function translateBug($bug)
    {
        $bug['description'] = $this->translate($bug['description']);
        $search = array("\$1", "\$2", "\$3", "\$4", "\$5");
        $placeholder1 = $this->translate($bug['txt1']);
        $placeholder2 = $this->translate($bug['txt2']);
        $placeholder3 = $this->translate($bug['txt3']);
        $placeholder4 = $this->translate($bug['txt4']);
        $placeholder5 = $this->translate($bug['txt5']);
        $replace = array($placeholder1, $placeholder2, $placeholder3, $placeholder4, $placeholder5);
        $bug['description'] = str_replace($search, $replace, $bug['description']);

        return $bug;
    }
}
