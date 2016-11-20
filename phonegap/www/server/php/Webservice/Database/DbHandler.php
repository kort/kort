<?php
/**
 * kort - Webservice\Database\DbHandler class
 */
namespace Webservice\Database;

use Webservice\DbWebserviceConfig;

/**
 * The DbHandler class takes care of all requests to the db webservice.
 */
class DbHandler
{
    /**
     * The database connection.
     *
     * @var PsqlConnection
     */
    protected $db;

    /**
     * Create a new DbHandler.
     *
     * The parameter is only used for unit testing.
     * Normally the database gets initialized by a DbConfig object.
     *
     * @param PsqlConnection $db Database connection object.
     */
    public function __construct(PsqlConnection $db = null)
    {
        if (empty($db)) {
            $this->db = new PsqlConnection(new DbConfig());
        } else {
            $this->db = $db;
        }
    }

    /**
     * Run SQL statement on the database.
     *
     * @param string $sql Arbitrary sql statement.
     *
     * @return string|false if the sql statements succeeds,
     * this method return the results as JSON-encoded string, false otherwise
     */
    public function doSql($sql)
    {
        $result = $this->db->doQuery($sql);
        if (!$result) {
            return $result;
        } else {
            return json_encode($result);
        }
    }

    /**
     * Run a select query on the database.
     *
     * @param array   $fields  Fields of the table.
     * @param string  $table   Table name.
     * @param string  $where   Where clause (condition).
     * @param string  $orderBy Order by clause (sorting).
     * @param integer $limit   Amount of records to return.
     *
     * @return string|false if the sql statements succeeds,
     * this method return the results as JSON-encoded string, false otherwise
     */
    public function doSelect(array $fields, $table, $where, $orderBy, $limit)
    {
        if (!$limit || $limit > 5000) {
            $limit = 5000;
        }
        $result = $this->db->doSelectQuery($fields, $table, $where, $orderBy, $limit);
        return (count($result) > 0) ? json_encode($result) : false;
    }

    /**
     * The same as doSelect, but the parameter is an array.
     *
     * @param array $params Array with parameters.
     *
     * @return string|false JSON-encoded string if successful, false otherwise
     * @see    doSelect
     */
    protected function doSelectWithParams(array $params)
    {
        $fields = $params['fields'];
        $table = $params['table'];
        $where = $params['where'];
        $orderBy = $params['orderBy'];
        $limit = $params['limit'];
        return $this->doSelect($fields, $table, $where, $orderBy, $limit);
    }

    /**
     * Run a insert query on the database.
     *
     * @param array  $fields       Fields of the table.
     * @param string $table        Table name.
     * @param array  $data         Key/value (field/data) pairs for all fields.
     * @param array  $returnFields Fields to return from this query.
     *
     * @return string|false if the sql statements succeeds,
     * this method returns the results as JSON-encoded string, false otherwise
     */
    public function doInsert(array $fields, $table, array $data, array $returnFields)
    {
        $data = $this->reduceData($fields, $data);
        $insertedData = $this->db->doInsertQuery($data, $table, $returnFields);
        if (!$insertedData) {
            return $insertedData;
        } else {
            return json_encode($insertedData);
        }
    }

    /**
     * The same as doInsert, but the parameter is an array.
     *
     * @param array $params Array with parameters.
     *
     * @return string|false JSON-encoded string if successful, false otherwise
     * @see    doInsert
     */
    protected function doInsertWithParams(array $params)
    {
        $fields = $params['fields'];
        $table = $params['table'];
        $data = $params['data'];
        $returnFields = $params['returnFields'];
        return $this->doInsert($fields, $table, $data, $returnFields);
    }

    /**
     * Run a update query on the database.
     *
     * @param array  $fields       Fields of the table.
     * @param string $table        Table name.
     * @param array  $data         Key/value (field/data) pairs for all fields.
     * @param string $where        Where clause (condition).
     * @param array  $returnFields Fields to return from this query.
     *
     * @return string|false JSON-encoded string if successful, false otherwise
     */
    public function doUpdate(array $fields, $table, array $data, $where, array $returnFields)
    {
        $data = $this->reduceData($fields, $data);
        $updatedData = $this->db->doUpdateQuery($data, $table, $where, $returnFields);
        if (!$updatedData) {
            return $updatedData;
        } else {
            return json_encode($updatedData);
        }
    }

    /**
     * The same as doUpdate, but the parameter is an array.
     *
     * @param array $params Array with parameters.
     *
     * @return string|false JSON-encoded string if successful, false otherwise
     * @see    doUpdate
     */
    protected function doUpdateWithParams(array $params)
    {
        $fields = $params['fields'];
        $table = $params['table'];
        $data = $params['data'];
        $where = $params['where'];
        $returnFields = $params['returnFields'];
        return $this->doUpdate($fields, $table, $data, $where, $returnFields);
    }

    /**
     * Run multiple sql statements in a transaction.
     *
     * @param array $statements Multiple statements, each entry containing a param array.
     *
     * @return array|string an array where each entry is the result of the corresponding
     * sql statement. If one query fails, the transaction is rollbacked and an error
     * message is returned.
     */
    public function doTransaction(array $statements)
    {
        $returnValue = "";
        $returnValues = array();
        $this->db->beginTransaction();
        foreach ($statements as $params) {
            switch($params['type']) {
                case "SQL":
                    $returnValue = $this->doSql($params['sql']);
                    break;
                case "INSERT":
                    $returnValue = $this->doInsertWithParams($params);
                    break;
                case "UPDATE":
                    $returnValue = $this->doUpdateWithParams($params);
                    break;
                case "SELECT":
                    $returnValue = $this->doSelectWithParams($params);
                    break;
                default:
                    $returnValue = false;
            }
            if ($returnValue === false) {
                $this->db->rollbackTransaction();
                return "Transaction has been rollbacked! Params: " . json_encode($params);
            } else {
                if (!is_array($returnValue)) {
                    $returnValue = json_decode($returnValue, true);
                }
                $returnValues[] = $returnValue;
            }
        }
        $this->db->commitTransaction();
        return json_encode($returnValues);
    }

    /**
     * Helper method to remove entries from $data that are not included in $fields.
     *
     * @param array $fields The requested fields.
     * @param array $data   The data to reduce.
     *
     * @return array the $data array filter by the requested fields
     * @see    doInsert
     */
    protected function reduceData(array $fields, array $data)
    {
        $reducedData = array();
        foreach ($fields as $key) {
            if (array_key_exists($key, $data)) {
                $reducedData[$key] = $data[$key];
            }
        }
        return $reducedData;
    }

    /**
     * Checks if the call to the webservice is made with a valid API key.
     *
     * @param string $apiKey The API key sent by the client.
     *
     * @return bool true if the key is correct, false otherwise
     */
    public function checkAuth($apiKey)
    {
        $wsConfig = new DbWebserviceConfig();
        return ($wsConfig->getApiKey() === $apiKey);
    }
}
