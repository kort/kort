<?php
namespace Webservice\Database;

class PsqlConnection
{
    protected $dbConn = null;
    protected $errorTable = 'kort.errors';
    protected $errorFields = array(
        'id',
        'schema',
        'type',
        'osm_id',
        'osm_type',
        'title',
        'description',
        'latitude',
        'longitude'
    );
    protected $fixTable = 'kort.fix';
    protected $fixFields = array(
        'error_id',
        'message'
    );

    public function __construct($dbConfig, $errorFields = null, $errorTable = '', $fixTable = '')
    {
        $conn_string = $this->createConnectionString($dbConfig);
        $this->createDbConnection($conn_string);
        if ($errorFields) {
            $this->errorFields = $errorFields;
        }
        if ($errorTable != '') {
            $this->errorTable = $errorTable;
        }
        if ($fixTable != '') {
            $this->fixTable = $fixTable;
        }
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

    public function doSelectQuery($where, $orderBy = '', $limit = null)
    {
        $queryStr = 'SELECT '.implode(',', $this->errorFields).' FROM '.$this->errorTable;

        if ($where != '') {
            $queryStr .= ' WHERE '.$where;
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

    public function doInsertQuery($values)
    {
        $insertStr = 'INSERT INTO '.$this->fixTable;
        $fieldsStr = ' (id, create_date, '.implode(',', $this->fixFields).')';

        foreach ($values as $key => $value) {
            if (!is_numeric($value)) {
                $values[$key] = '\''.$value.'\'';
            }
        }
        $valuesStr = ' VALUES (nextval(\'kort.fix_id\'), now(), '.implode(',', $values).')';

        $insertStr .= $fieldsStr;
        $insertStr .= $valuesStr;
        $insertStr .= ';';

        $result = pg_query($this->dbConn, $insertStr);

        return $result;
    }

    protected function close()
    {
        pg_close($this->dbConn);
    }
}
