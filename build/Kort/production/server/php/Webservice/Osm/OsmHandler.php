<?php
namespace Webservice\Osm;

class OsmHandler
{
    public function getOsmData($type, $id)
    {
        $osmApiUrl = 'http://www.openstreetmap.org/api/0.6';
        $url = $osmApiUrl . '/' . $type . '/' . $id;
        if ($type == 'way' || $type == 'relation') {
            $url .= '/full';
        }
        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $result = curl_exec($curl);

        curl_close($curl);

        echo $result;
    }
}
