<?php
/**
 * kort - Webservice\Database\PsqlConnection class
 */
namespace Webservice\Database;

use Helper\PgHelper;

/**
 *The PsqlConnection class is an abstraction of a PostgreSQL database connection
 */
class PsqlConnection
{
    /** A PostgreSQL-specific helper object to run queries on the database */
    protected $db = null;

    /**
     * Create a new database connection wrapped in a PsqlConnection object
     * @param DbConfig $dbConfig the configuration for the connection
     * @param PgHelper $db parameter to inject a different PgHelper (used for unit testing only)
     */
    public function __construct($dbConfig, $db = null)
    {
        if (!empty($db)) {
            $this->db = $db;
        } else {
            $conn_string = $this->createConnectionString($dbConfig);
            $this->db = new PgHelper($conn_string);
        }
    }

    /**
     * Closes the db connection when the object is destroyed.
     */
    public function __destruct()
    {
        $this->db->close();
    }

    /**
     * Run any kind of query (passthrough) on the database
     * @param string $sql an arbitrary sql statement
     * @return array the result of the query from the database
     */
    public function doQuery($sql)
    {
        return $this->db->query($sql);
    }

    /**
     * Run a select query
     * @param array $fieldsArr fields of the table
     * @param string $table table name
     * @param string $where where clause (condition)
     * @param string $orderBy order by clause (sorting)
     * @param int $limit amount of records to return
     * @return array result of the query from the database
     */
    public function doSelectQuery($fieldsArr, $table, $where, $orderBy = '', $limit = null)
    {
        $selectSql = $this->generateSelectSql($fieldsArr, $table, $where, $orderBy, $limit);
        return $this->db->query($selectSql);
    }

    /**
     * Run a insert query on the database
     * @param array $dataArr key/value (field/data) pairs for all fields
     * @param string $table table name
     * @param array $returnFields fields to return from this query
     * @return array result of the query from the database
     */
    public function doInsertQuery($dataArr, $table, $returnFields)
    {
        $insertSql = $this->generateInsertSql(array_keys($dataArr), $table, $returnFields);
        $this->db->prepare("insert-kort", $insertSql);
        $result = $this->db->execute("insert-kort", array_values($dataArr));

        return $this->db->fetchRow($result);
    }

    /**
     * Run a update query on the database
     * @param array $dataArr key/value (field/data) pairs for all fields
     * @param string $table table name
     * @param string $where where clause (condition)
     * @param array $returnFields fields to return from this query
     * @return array result of the query from the database
     */
    public function doUpdateQuery($dataArr, $table, $where, $returnFields)
    {
        $updateSql = $this->generateUpdateSql(array_keys($dataArr), $table, $where, $returnFields);
        $this->db->prepare("update-kort", $updateSql);
        $result = $this->db->execute("update-kort", array_values($dataArr));
        return $this->db->fetchRow($result);
    }

    /**
     * Indicate the begin of a transaction
     */
    public function beginTransaction()
    {
        $this->db->begin();
    }

    /**
     * Indicate the end of a transaction
     */
    public function commitTransaction()
    {
        $this->db->commit();
    }

    /**
     * Rollback the transaction
     */
    public function rollbackTransaction()
    {
        $this->db->rollback();
    }

    /**
     * Creates a database connection string based on the given configuration
     * @param DbConfig $dbConfig the configuration of the database connection
     * @return string the connection string
     */
    protected function createConnectionString($dbConfig)
    {
        $conn_string  = 'host='.$dbConfig->host;
        $conn_string .= ' port='.$dbConfig->port;
        $conn_string .= ' dbname='.$dbConfig->dbname;
        $conn_string .= ' user='.$dbConfig->user;
        $conn_string .= ' password='.$dbConfig->password;
        return $conn_string;
    }

    /**
     * Generates a insert statement using placeholders
     * @param array $fields fields of the table
     * @param string $table table name
     * @param array $returnFields fields to return from this query
     * @return string the generated sql statement
     */
    protected function generateInsertSql($fields, $table, $returnFields)
    {
        $numbers = range(1, count($fields));
        $sql  = "INSERT INTO " . $table;
        $sql .= " (" . implode(",", $fields) . ")";
        $sql .= " VALUES (";
        $sql .= implode(
            ',',
            array_map(
                function ($number) {
                    return "$". $number;
                },
                $numbers
            )
        );
        $sql .=  ')';

        if ($returnFields) {
            $sql .= " RETURNING " . implode(",", $returnFields);
        }
        $sql .= ";";

        return $sql;
    }

    /**
     * Generates a update statement using placeholders
     * @param array $fields fields of the table
     * @param string $table table name
     * @param string $where where clause (condition)
     * @param array $returnFields fields to return from this query
     * @return string the generated sql statement
     */
    protected function generateUpdateSql($fields, $table, $where, $returnFields)
    {
        $numbers = range(1, count($fields));
        $sql = "UPDATE " . $table . " set ";
        $sql .= implode(
            ',',
            array_map(
                function (
                    $field,
                    $number
                ) {
                    return $field . " = $". $number;
                },
                $fields,
                $numbers
            )
        );
        if (!empty($where)) {
            $sql .= " WHERE " . $where;
        }
        if ($returnFields) {
            $sql .= " RETURNING " . implode(",", $returnFields);
        }
        $sql .=  ';';

        return $sql;
    }

    /**
     * Generate a select statement
     * @param array $fields fields of the table
     * @param string $table table name
     * @param string $where where clause (condition)
     * @param string $orderBy order by clause (sorting)
     * @param int $limit amount of records to return
     * @return string the generated sql statement
     */
    protected function generateSelectSql($fields, $table, $where, $orderBy, $limit)
    {
        $sql = "SELECT ";
        if (count($fields) == 0) {
            $sql .= "*";
        } elseif (is_array($fields)) {
            $sql .= implode(',', $fields);
        } else {
            $sql .= $fields;
        }
        if (!empty($table)) {
            $sql .= " FROM " . $table;
        }
        if (!empty($where)) {
            $sql .= " WHERE " . $where;
        }
        if (!empty($orderBy)) {
            $sql .= " ORDER BY " . $orderBy;
        }
        if (!empty($limit)) {
            $sql .= " LIMIT " . $limit;
        }

        $sql .=  ';';

        return $sql;
    }
}
