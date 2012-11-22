<?php
namespace Webservice\Database;

class DbHandler
{
    protected $db;

    public function __construct($db = null)
    {
        if ($db == null) {
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

    public function doInsert($fields, $table, $data)
    {
        foreach ($fields as $key) {
            if (array_key_exists($key, $data)) {
                $data[$key] = $this->db->escapeLitereal($data[$key]);
            }
        }
        $this->db->doInsertQuery($data, $table);
    }
}
