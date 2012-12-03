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

    public function doTransaction($statements)
    {
        $returnValue = "";
        foreach ($statements as $params) {
            switch($params['type']) {
                case "INSERT":
                    $result = $this->doInsert($params['fields'], $params['table'], $params['data'], $params['returnFields']);
                    if ($params['return']) {
                        $returnValue = $result;
                    }
                    break;
                case "UPDATE":
                    $result = $this->doUpdate($params['fields'], $params['table'], $params['data'], $params['where'], $params['returnFields']);
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
        }
        return $returnValue;
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
