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

    public function doUpdate($fields, $table, $data, $where)
    {
        $data = $this->reduceData($fields, $data);
        $updatedData = $this->db->doUpdateQuery($data, $table, $where);
        if (!$updatedData) {
            return $updatedData;
        } else {
            return json_encode($updatedData);
        }
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
