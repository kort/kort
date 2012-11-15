<?php
namespace Helper;

class PostGisSqlHelper
{
    public static function getLatLngGeom($lat, $lng)
    {
        return "ST_Transform(ST_SetSRID(ST_Point(".$lng.",".$lat."),4326),900913)";
    }
}
