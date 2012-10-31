<?php
namespace Webservice\Database;

class PsqlHelper
{
    protected $dbConn = null;
    protected $defaultErrorFields = array(
        'error_id AS id',
        'schema',
        'error_type AS type',
        'object_id AS osm_id',
        'object_type AS osm_type',
        'error_name AS title',
        'msgid AS description',
        'CAST(lat AS NUMERIC)/10000000 AS latitude',
        'CAST(lon AS NUMERIC)/10000000 AS longitude',
        'txt1',
        'txt2',
        'txt3',
        'txt4',
        'txt5'
    );
    protected $defaultErrorTable = 'keepright.errors';
    protected $defaultFixTable = 'kort.fix';
    protected $defaultFixFields = array(
        'error_id',
        'message'
    );

    public function __construct($dbConfig, $defaultErrorFields = null, $defaultErrorTable = '', $defaultFixTable = '')
    {
        $conn_string = $this->createConnectionString($dbConfig);
        $this->createDbConnection($conn_string);
        if ($defaultErrorFields) {
            $this->defaultErrorFields = $defaultErrorFields;
        }
        if ($defaultErrorTable != '') {
            $this->defaultErrorTable = $defaultErrorTable;
        }
        if ($defaultFixTable != '') {
            $this->defaultFixTable = $defaultFixTable;
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
        $db = pg_connect($conn_string) or die('connection failed');
        $this->dbConn = $db;
    }

    public function doSelectQuery($where, $fields = null, $form = '')
    {
        if (!$fields) {
            $fields = $this->defaultErrorFields;
        }
        if ($form == '') {
            $form = $this->defaultErrorTable;
        }

        $queryStr = 'SELECT '.implode(',', $fields).' FROM '.$form;

        if ($where != '') {
            $queryStr .= ' WHERE '.$where;
        }

        $queryStr .= ';';

        $result = pg_query($this->dbConn, $queryStr);

        $resultArr = array();
        // TODO ugly way to replace placeholders in description (use regex)
        while ($row = pg_fetch_assoc($result)) {
            for ($i = 1; $i <= 5; $i++) {
                $row['description'] = $this->replaceDescriptionPlaceholders($row, $i);
                unset($row['txt'.$i]);
            }
            $resultArr[] = $row;
        }
        return $resultArr;
    }

    public function doInsertQuery($values, $fields = null)
    {
        $insertStr = 'INSERT INTO '.$this->defaultFixTable;

        // TODO implement fields/values with map
        if (!$fields) {
            $fields = $this->defaultFixFields;
        }

        $fieldsStr = ' (id, create_date, '.implode(',', $fields).')';

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

    protected function replaceDescriptionPlaceholders($row, $placeholderNumber)
    {
        return str_replace('$'.$placeholderNumber, $row['txt'.$placeholderNumber], $row['description']);
    }

    // closes the database connection
    protected function close()
    {
        pg_close($this->dbConn);
    }
}
