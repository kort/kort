<?php
namespace Webservice\Database;

use Helper\PgHelper;

class PsqlConnection
{
    protected $db = null;

    public function __construct($dbConfig, $db = null)
    {
        if (!empty($db)) {
            $this->db = $db;
        } else {
            $conn_string = $this->createConnectionString($dbConfig);
            $this->db = new PgHelper($conn_string);
        }
    }

    public function __destruct()
    {
        $this->db->close();
    }

    public function doSelectQuery($fieldsArr, $table, $where, $orderBy = '', $limit = null)
    {
        $selectSql = $this->generateSelectSql($fieldsArr, $table, $where, $orderBy, $limit);
        $result =$this->db->query($selectSql);

        return $result;
    }

    public function doInsertQuery($dataArr, $table)
    {
        $insertSql = $this->generateInsertSql(array_keys($dataArr), $table);
        $this->db->prepare("insert-kort", $insertSql);
        $result = $this->db->execute("insert-kort", array_values($dataArr));
        return $result;
    }

    public function doUpdateQuery($dataArr, $table, $where)
    {
        $updateSql = $this->generateUpdateSql(array_keys($dataArr), $table, $where);
        $this->db->prepare("update-kort", $updateSql);
        $result = $this->db->execute("update-kort", array_values($dataArr));
        return $result;
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

    protected function generateInsertSql($fields, $table)
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
        $sql .=  ');';

        return $sql;
    }

    protected function generateUpdateSql($fields, $table, $where)
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
        $sql .=  ';';

        return $sql;
    }

    protected function generateSelectSql($fields, $table, $where, $orderBy, $limit)
    {
        $sql = "SELECT ";
        if (count($fields) == 0) {
            $sql .= "*";
        } else {
            $sql .= implode(',', $fields);
        }
        $sql .= " FROM " . $table;
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
