<?php
namespace Webservice\Database;

use Webservice\DbWebserviceConfig;

class DbHandler
{
    protected $db;

    public function __construct($db = null)
    {
        if (empty($db)) {
            $this->db = new PsqlConnection(new DbConfig());
        } else {
            $this->db = $db;
        }
    }

    public function doSql($sql)
    {
        $result = $this->db->doQuery($sql);
        if (!$result) {
            return $result;
        } else {
            return json_encode($result);
        }
    }

    public function doSelect($fields, $table, $where, $orderBy, $limit)
    {
        if (!$limit || $limit > 500) {
            $limit = 500;
        }
        $result = $this->db->doSelectQuery($fields, $table, $where, $orderBy, $limit);
        return (count($result) > 0) ? json_encode($result) : false;
    }

    public function doInsert($fields, $table, $data, $returnFields)
    {
        $data = $this->reduceData($fields, $data);
        $insertedData = $this->db->doInsertQuery($data, $table, $returnFields);
        if (!$insertedData) {
            return $insertedData;
        } else {
            return json_encode($insertedData);
        }
    }

    public function doUpdate($fields, $table, $data, $where, $returnFields, $passthru = false)
    {
        $data = $this->reduceData($fields, $data);
        $updatedData = $this->db->doUpdateQuery($data, $table, $where, $returnFields, $passthru);
        if (!$updatedData) {
            return $updatedData;
        } else {
            return json_encode($updatedData);
        }
    }

    public function doTransaction($statements)
    {
        $returnValue = "";
        $returnValues = array();
        $this->db->beginTransaction();
        foreach ($statements as $params) {
            switch($params['type']) {
                case "SQL":
                    $returnValue = $this->doSql($params['sql']);
                    break;
                case "INSERT":
                    $returnValue = $this->doInsert($params['fields'], $params['table'], $params['data'], $params['returnFields']);
                    break;
                case "UPDATE":
                    $returnValue = $this->doUpdate($params['fields'], $params['table'], $params['data'], $params['where'], $params['returnFields'], true);
                    break;
                case "SELECT":
                    $returnValue = $this->doSelect($params['fields'], $params['table'], $params['where'], $params['orderBy'], $params['limit']);
                    break;
                default:
                    $returnValue = false;
            }
            if ($returnValue === false) {
                $this->db->rollbackTransaction();
                return "Transaction has been rollbacked! Params: " . json_encode($params);
            } else {
                if (!is_array($returnValue)) {
                    $returnValue = json_decode($returnValue, true);
                }
                $returnValues[] = $returnValue;
            }
        }
        $this->db->commitTransaction();
        return json_encode($returnValues);
    }

    protected function reduceData($fields, $data)
    {
        $reducedData = array();
        foreach ($fields as $key) {
            if (array_key_exists($key, $data)) {
                $reducedData[$key] = $data[$key];
            }
        }
        return $reducedData;
    }

    public function checkAuth($apiKey)
    {
        $wsConfig = new DbWebserviceConfig();
        return ($wsConfig->getApiKey() === $apiKey);
    }
}
