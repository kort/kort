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

    protected function doSelectWithParams($params)
    {
        $fields = $params['fields'];
        $table = $params['table'];
        $where = $params['where'];
        $orderBy = $params['orderBy'];
        $limit = $params['limit'];
        return $this->doSelect($fields, $table, $where, $orderBy, $limit);
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

    protected function doInsertWithParams($params)
    {
        $fields = $params['fields'];
        $table = $params['table'];
        $data = $params['data'];
        $returnFields = $params['returnFields'];
        return $this->doInsert($fields, $table, $data, $returnFields);
    }

    public function doUpdate($fields, $table, $data, $where, $returnFields)
    {
        $data = $this->reduceData($fields, $data);
        $updatedData = $this->db->doUpdateQuery($data, $table, $where, $returnFields);
        if (!$updatedData) {
            return $updatedData;
        } else {
            return json_encode($updatedData);
        }
    }

    protected function doUpdateWithParams($params)
    {
        $fields = $params['fields'];
        $table = $params['table'];
        $data = $params['data'];
        $where = $params['where'];
        $returnFields = $params['returnFields'];
        return $this->doUpdate($fields, $table, $data, $where, $returnFields);
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
                    $returnValue = $this->doInsertWithParams($params);
                    break;
                case "UPDATE":
                    $returnValue = $this->doUpdateWithParams($params);
                    break;
                case "SELECT":
                    $returnValue = $this->doSelectWithParams($params);
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
