<?php
namespace Webservice\Database;

class PsqlConnection
{
    protected $dbConn = null;

    public function __construct($dbConfig)
    {
        $conn_string = $this->createConnectionString($dbConfig);
        $this->createDbConnection($conn_string);
    }

    public function __destruct()
    {
        $this->close();
    }

    protected function createConnectionString($dbConfig)
    {
        $conn_string  = 'host='.$dbConfig->host;
        $conn_string .= ' port='.$dbConfig->port;
        $conn_string .= ' dbname='.$dbConfig->dbname;
        $conn_string .= ' user='.$dbConfig->user;
        $conn_string .= ' password='.$dbConfig->password;
        return $conn_string;
    }

    // creates database connection
    protected function createDbConnection($conn_string)
    {
        $db = pg_connect($conn_string);
        $this->dbConn = $db;
    }

    public function doSelectQuery($fieldsArr, $table, $condition, $orderBy = '', $limit = null)
    {
        $queryStr = 'SELECT '.implode(',', $fieldsArr).' FROM '.$table;

        if ($condition != '') {
            $queryStr .= ' WHERE '.$condition;
        }

        if ($orderBy != '') {
            $queryStr .= ' ORDER BY '.$orderBy;
        }

        if ($limit) {
            $queryStr .= ' LIMIT '.$limit;
        }

        $queryStr .= ';';
        $result = pg_query($this->dbConn, $queryStr);

        $resultArr = array();
        while ($row = pg_fetch_assoc($result)) {
            $resultArr[] = $row;
        }
        return $resultArr;
    }

    public function doInsertQuery($dataArr, $table)
    {
        $insertStr = 'INSERT INTO '.$table;
        $insertStr .= ' (' . implode(',', array_keys($dataArr)) . ')';
        $insertStr .= ' VALUES (' . implode(',', array_values($dataArr)) . ')';
        $insertStr .= ';';

        $result = pg_query($this->dbConn, $insertStr);

        return $result;
    }

    public function escapeLitereal($value)
    {
        if ($value && !is_numeric($value)) {
            return "'" . $value . "'";
        }
        return $value;
    }

    protected function close()
    {
        pg_close($this->dbConn);
    }
}
