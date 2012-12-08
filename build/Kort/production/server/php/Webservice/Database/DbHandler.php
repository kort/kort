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
        return (count($result) > 0) ? json_encode($result) : "";
    }

    public function doInsert($fields, $table, $data, $returnFields)
    {
        $data = $this->reduceData($fields, $data);
        $insertedData = $this->db->doInsertQuery($data, $table, $returnFields);
        return json_encode($insertedData);
        if (!$insertedData) {
            return $insertedData;
        } else {
            json_encode($insertedData);
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
                    $result = $this->doSql($params['sql']);
                    if ($params['return']) {
                        $returnValue = $result;
                    }
                    break;
                case "INSERT":
                    $result = $this->doInsert($params['fields'], $params['table'], $params['data'], $params['returnFields']);
                    if ($params['return']) {
                        $returnValue = $result;
                    }
                    break;
                case "UPDATE":
                    $result = $this->doUpdate($params['fields'], $params['table'], $params['data'], $params['where'], $params['returnFields'], true);
                    if ($params['return']) {
                        $returnValue = $result;
                    }
                    break;
                case "SELECT":
                    $result = $this->doSelect($params['fields'], $params['table'], $params['where'], $params['orderBy'], $params['limit']);
                    if ($params['return']) {
                        $returnValue = $result;
                    }
                    break;
                default:
                    $returnValue = false;
            }
            if ($returnValue === false) {
                $this->db->rollbackTransaction();
                return "Transaction has been rollbacked!";
            } else {
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
