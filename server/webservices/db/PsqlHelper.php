<?php
class PsqlHelper {
    protected $dbConn = null;
    protected $defaultFields = 'error_id AS id, error_name AS title, msgid AS description, CAST(lat AS NUMERIC)/10000000 AS latitude, CAST(lon AS NUMERIC)/10000000 AS longitude, error_type AS type, txt1, txt2, txt3, txt4, txt5';
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
        // TODO ugly way to replace placeholders in description
        while ($row = pg_fetch_assoc($result)) {
            for($i = 1; $i <= 5; $i++) {
                $row['description'] = $this->replaceDescriptionPlaceholders($row, $i);
                unset($row['txt'.$i]);
            }
            $resultArr[] = $row;
        }
        return $resultArr;
    }
    
    function replaceDescriptionPlaceholders($row, $placeholderNumber) {
        return str_replace('$'.$placeholderNumber, $row['txt'.$placeholderNumber], $row['description']);
    }
    
    // closes the database connection
    function close() {
        pg_close($this->dbConn);
    }
}
?>
