<?php
/**
 * kort - Webservice\Osm\OsmHandler class
 */
namespace Webservice\Osm;

use Helper\CurlHelper;

/**
 * The OsmHandler class handles the requests to the osm webservice.
 */
class OsmHandler
{
    /**
     * Returns the details for the requested OpenStreetMap object.
     *
     * This method directly calls the OpenStreetMap API.
     *
     * @param string  $type The object type, either point, way or relation.
     * @param integer $id   The object id.
     *
     * @return string the details of the requested OpenStreetMap object
     */
    public function getOsmData($type, $id)
    {
        $osmApiUrl = 'http://www.openstreetmap.org/api/0.6';
        $url = $osmApiUrl . '/' . $type . '/' . $id;
        if ($type == 'way' || $type == 'relation') {
            $url .= '/full';
        }
        $curl = new CurlHelper();
        $curl->setOption(CURLOPT_URL, $url);
        $curl->setOption(CURLOPT_RETURNTRANSFER, 1);
        $result = $curl->execute();
        $curl->close();

        return $result;
    }
}
