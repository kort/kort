<?php
class PsqlHelper {
    protected $dbConn = null;
    protected $defaultFields = 'error_id AS id, error_name AS title, COALESCE(comment, \'\') AS description, (lat/10000000) AS latitude, (lon/10000000) AS longitude, msgid AS type';
    protected $defaultTable = 'keepright.errors';
    
    public function __construct($dbConfig, $defaultFields = '', $defaultTable = '') {
        $conn_string = 'host='.$dbConfig->host.' port='.$dbConfig->port.' dbname='.$dbConfig->dbname.' user='.$dbConfig->user.' password='.$dbConfig->password;
        $this->createDbConnection($conn_string);
        if($defaultFields != '') {
            $this->defaultFields = $defaultFields;
        }
        if($defaultTable != '') {
            $this->defaultTable = $defaultTable;
        }
    }
    
    // creates database connection
    function createDbConnection($conn_string) {
        $db = pg_connect($conn_string) or die('connection failed');
        $this->dbConn = $db;
    }
    
    function doSelectQuery($where, $fields = "", $form = "") {
        if($fields == '') {
            $fields = $this->defaultFields;
        }
        if($form == '') {
            $form = $this->defaultTable;
        }
        
        $queryStr = 'SELECT '.$fields.' FROM '.$form;
        
        if($where != '') {
            $queryStr .= ' WHERE '.$where;
        }
        
        $result = pg_query($this->dbConn, $queryStr);
        
        $resultArr = array();
        while ($row = pg_fetch_assoc($result)) {
            $resultArr[] = $row;
        }
        return $resultArr;
    }
    
    // closes the database connection
    function close() {
        pg_close($this->dbConn);
    }
}
?>
