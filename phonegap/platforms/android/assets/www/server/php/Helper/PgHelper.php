<?php
/**
 * kort - Helper\PgHelper class
 */

namespace Helper;

/**
 * THe PgHelper class is a wrapper around the various pg_* function of PHP.
 *
 * This makes it easier to access them, and can be used for testing by mocking this class.
 */
class PgHelper
{
    /**
     * A PostgreSQL database connection.
     *
     * @var mixed
     */
    protected $dbConn;

    /**
     * Creates a new PgHelper object and connects to the database using the $connectionString.
     *
     * @param string $connectionString Details how to connect to the database.
     */
    public function __construct($connectionString)
    {
        $this->dbConn = pg_connect($connectionString);
    }

    /**
     * Run a query against the database.
     *
     * @param string $sql Arbitrary sql statement.
     *
     * @return array the result of the query
     */
    public function query($sql)
    {
        $result = pg_query($this->dbConn, $sql);
        $resultArr = array();
        while ($row = pg_fetch_assoc($result)) {
            $resultArr[] = $row;
        }
        return $resultArr;
    }

    /**
     * Prepares a statement before it is run on the database.
     *
     * This can be used for security or performance issues.
     *
     * @param string $name              The name of the statement.
     * @param string $preparedStatement The sql statement to prepare.
     *
     * @return void
     */
    public function prepare($name, $preparedStatement)
    {
        pg_prepare($this->dbConn, $name, $preparedStatement);
    }

    /**
     * Executes a previoulsy prepared query.
     *
     * @param string $name      The name of the query.
     * @param array  $parameter An array containing substitustions for the bind variables.
     *
     * @return resource|false a query resource on success, false otherwise.
     */
    public function execute($name, array $parameter)
    {
        return pg_execute($this->dbConn, $name, $parameter);
    }

    /**
     * Fetches a row from the database based on a query resource.
     *
     * @param mixed $result Query result resource.
     *
     * @return array the response form the database
     */
    public function fetchRow($result)
    {
        return pg_fetch_array($result, null, PGSQL_ASSOC);
    }

    /**
     * Begin a transation.
     *
     * @return resource|false a query resource on success, false otherwise
     */
    public function begin()
    {
        return pg_query($this->dbConn, "BEGIN;");
    }

    /**
     * Commit a transation.
     *
     * @return resource|false a query resource on success, false otherwise
     */
    public function commit()
    {
        return pg_query($this->dbConn, "COMMIT;");
    }

    /**
     * Rollback a transation.
     *
     * @return resource|false a query resource on success, false otherwise
     */
    public function rollback()
    {
        return pg_query($this->dbConn, "ROLLBACK;");
    }

    /**
     * Closes the datbase connection.
     *
     * @return void
     */
    public function close()
    {
        pg_close($this->dbConn);
    }
}
