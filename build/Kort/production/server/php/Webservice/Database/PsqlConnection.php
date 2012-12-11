<?php
/**
 * kort - Webservice\Database\PsqlConnection class
 */
namespace Webservice\Database;

use Helper\PgHelper;

/**
 *The PsqlConnection class is an abstraction of a PostgreSQL database connection.
 */
class PsqlConnection
{
    /**
     * A PostgreSQL-specific helper object to run queries on the database.
     *
     * @var PgHelper
     */
    protected $db = null;

    /**
     * Create a new database connection wrapped in a PsqlConnection object.
     *
     * @param DbConfig $dbConfig The configuration for the connection.
     * @param PgHelper $db       Parameter to inject a different PgHelper (used for unit testing only).
     */
    public function __construct(DbConfig $dbConfig, PgHelper $db = null)
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
        if ($this->db) {
            $this->db->close();
        }
    }

    /**
     * Run any kind of query (passthrough) on the database.
     *
     * @param string $sql Arbitrary sql statement.
     *
     * @return array the result of the query from the database
     */
    public function doQuery($sql)
    {
        return $this->db->query($sql);
    }

    /**
     * Run a select query.
     *
     * @param array   $fieldsArr Fields of the table.
     * @param string  $table     Table name.
     * @param string  $where     Where clause (condition).
     * @param string  $orderBy   Order by clause (sorting).
     * @param integer $limit     Amount of records to return.
     *
     * @return array result of the query from the database
     */
    public function doSelectQuery(array $fieldsArr, $table, $where, $orderBy = '', $limit = null)
    {
        $selectSql = $this->generateSelectSql($fieldsArr, $table, $where, $orderBy, $limit);
        return $this->db->query($selectSql);
    }

    /**
     * Run a insert query on the database.
     *
     * @param array  $dataArr      Key/value (field/data) pairs for all fields.
     * @param string $table        Table name.
     * @param array  $returnFields Fields to return from this query.
     *
     * @return array result of the query from the database
     */
    public function doInsertQuery(array $dataArr, $table, array $returnFields)
    {
        $insertSql = $this->generateInsertSql(array_keys($dataArr), $table, $returnFields);
        $this->db->prepare("insert-kort", $insertSql);
        $result = $this->db->execute("insert-kort", array_values($dataArr));

        return $this->db->fetchRow($result);
    }

    /**
     * Run a update query on the database.
     *
     * @param array  $dataArr      Key/value (field/data) pairs for all fields.
     * @param string $table        Table name.
     * @param string $where        Where clause (condition).
     * @param array  $returnFields Fields to return from this query.
     *
     * @return array result of the query from the database
     */
    public function doUpdateQuery(array $dataArr, $table, $where, array $returnFields)
    {
        $updateSql = $this->generateUpdateSql(array_keys($dataArr), $table, $where, $returnFields);
        $this->db->prepare("update-kort", $updateSql);
        $result = $this->db->execute("update-kort", array_values($dataArr));
        return $this->db->fetchRow($result);
    }

    /**
     * Indicate the begin of a transaction.
     *
     * @return void
     */
    public function beginTransaction()
    {
        $this->db->begin();
    }

    /**
     * Indicate the end of a transaction.
     *
     * @return void
     */
    public function commitTransaction()
    {
        $this->db->commit();
    }

    /**
     * Rollback the transaction.
     *
     * @return void
     */
    public function rollbackTransaction()
    {
        $this->db->rollback();
    }

    /**
     * Creates a database connection string based on the given configuration.
     *
     * @param DbConfig $dbConfig The configuration of the database connection.
     *
     * @return string the connection string
     */
    protected function createConnectionString(DbConfig $dbConfig)
    {
        $conn_string  = 'host='.$dbConfig->host;
        $conn_string .= ' port='.$dbConfig->port;
        $conn_string .= ' dbname='.$dbConfig->dbname;
        $conn_string .= ' user='.$dbConfig->user;
        $conn_string .= ' password='.$dbConfig->password;
        return $conn_string;
    }

    /**
     * Generates a insert statement using placeholders.
     *
     * @param array  $fields       Fields of the table.
     * @param string $table        Table name.
     * @param array  $returnFields Fields to return from this query.
     *
     * @return string the generated sql statement
     */
    protected function generateInsertSql(array $fields, $table, array $returnFields)
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
     * Generates a update statement using placeholders.
     *
     * @param array  $fields       Fields of the table.
     * @param string $table        Table name.
     * @param string $where        Where clause (condition).
     * @param array  $returnFields Fields to return from this query.
     *
     * @return string the generated sql statement
     */
    protected function generateUpdateSql(array $fields, $table, $where, array $returnFields)
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
     * Generate a select statement.
     *
     * @param array   $fields  Fields of the table.
     * @param string  $table   Table name.
     * @param string  $where   Where clause (condition).
     * @param string  $orderBy Order by clause (sorting).
     * @param integer $limit   Amount of records to return.
     *
     * @return string the generated sql statement
     */
    protected function generateSelectSql(array $fields, $table, $where, $orderBy, $limit)
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
