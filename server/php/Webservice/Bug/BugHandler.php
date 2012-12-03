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
            'answer_placeholder',
            'koin_count',
            'txt1',
            'txt2',
            'txt3',
            'txt4',
            'txt5'
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

        $bugInfos = json_decode($this->getDbProxy()->select(), true);
        $bugInfos = array_map(array($this, "translateBug"), $bugInfos);

        return json_encode($bugInfos);
    }

    public function translateBug($bug)
    {
        $bug['description'] = str_replace("\$", "%", $bug['description']);
        $bug['description'] = $this->translate($bug['description']);

        $search = array("%1", "\$2", "\$3", "\$4", "\$5");
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
