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
        $result = $this->db->query($selectSql);

        return $result;
    }

    public function doInsertQuery($dataArr, $table, $returnFields)
    {
        $insertSql = $this->generateInsertSql(array_keys($dataArr), $table, $returnFields);
        $this->db->prepare("insert-kort", $insertSql);
        $result = $this->db->execute("insert-kort", array_values($dataArr));

        return $this->db->fetchRow($result);
    }

    public function doUpdateQuery($dataArr, $table, $where, $returnFields, $passthru = false)
    {
        if ($passthru) {
            $updateSql = $this->generatePassthruUpdateSql($dataArr, $table, $where, $returnFields);
            $result = $this->db->query($updateSql);
            return $result[0];
        } else {
            $updateSql = $this->generateUpdateSql(array_keys($dataArr), $table, $where, $returnFields);
            $this->db->prepare("update-kort", $updateSql);
            $result = $this->db->execute("update-kort", array_values($dataArr));
            return $this->db->fetchRow($result);
        }

    }

    public function beginTransaction() {
        $this->db->begin();
    }

    public function commitTransaction() {
        $this->db->commit();
    }

    public function rollbackTransaction() {
        $this->db->rollback();
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

    protected function generatePassthruUpdateSql($data, $table, $where, $returnFields)
    {
        $sql = "UPDATE " . $table . " set ";
        $sql .= implode(
            ',',
            array_map(
                function (
                    $field,
                    $value
                ) {
                    return $field . " = ". $value;
                },
                array_keys($data),
                array_values($data)
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
