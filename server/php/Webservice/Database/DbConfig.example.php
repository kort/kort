<?php
/**
 * kort - Webservice\Database\DbConfig class
 */
namespace Webservice\Database;

/**
 * This is an example for the DbConfig class.
 *
 * setup these values and rename file to DbConfig.php
 *
 * @see DbConfig
 */
class DbConfig
{
    /** The host name of the db server */
    public $host = "localhost";
    /** The port on which the db runs */
    public $port = 5432;
    /** The name of the database */
    public $dbname = "osm_bugs";
    /** The database user */
    public $user = "osm";
    /** The password of the database user */
    public $password = "mysecretpassword";
}
