<?php
/**
 * kort - Webservice\Database\DbConfig class
 */
namespace Webservice\Database;

/**
 * This is an example for the DbConfig class.
 *
 * Setup these values and rename file to DbConfig.php
 */
class DbConfig
{
    /**
     * The host name of the db server.
     *
     * @var string
     */
    public $host = "localhost";

    /**
     * The port on which the db runs.
     *
     * @var integer
     */
    public $port = 5432;

    /**
     * The name of the database.
     *
     * @var string
     */
    public $dbname = "osm_bugs";

    /**
     * The database user.
     *
     * @var string
     */
    public $user = "osm";

    /**
     * The password of the database user.
     *
     * @var string
     */
    public $password = "mysecretpassword";
}
