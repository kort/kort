<?php

namespace Helper;

class PgHelper
{
    protected $dbConn;

    public function __construct($connectionString)
    {
        $this->dbConn = pg_connect($connectionString);
    }

    public function query($sql)
    {
        $result = pg_query($this->dbConn, $sql);
        $resultArr = array();
        while ($row = pg_fetch_assoc($result)) {
            $resultArr[] = $row;
        }
        return $resultArr;
    }

    public function prepare($name, $preparedStatement)
    {
        pg_prepare($this->dbConn, $name, $preparedStatement);
    }

    public function execute($name, $parameter)
    {
        return pg_execute($this->dbConn, $name, $parameter);
    }

    public function fetch_row($result)
    {
        return pg_fetch_array($result, null, PGSQL_ASSOC);
    }


    public function close()
    {
        pg_close($this->dbConn);
    }
}
