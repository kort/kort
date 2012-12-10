<?php
/**
 * kort - Helper\PostGisSqlHelper class
 */

namespace Helper;

/**
 * The PostGisSqlHelper class is a helper for PostGIS, the geospatial extension of PostGreSQL.
 *
 * It's intend is to simplify the SQL queries in the application and hide the complexity here.
 */
class PostGisSqlHelper
{
    /**
     * Returns the PostGIS functions to convert lat/lng to a point.
     *
     * @param float $lat Value of latitude in WSG84.
     * @param float $lng Value of longitude in WSG84.
     *
     * @return string a piece of PostGIS sql to represent a coordinate
     */
    public static function getLatLngGeom($lat, $lng)
    {
        return "ST_SetSRID(ST_Point(".$lng.",".$lat."),4326)";
    }
}
