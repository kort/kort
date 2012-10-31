<?php
namespace Webservice\Database;

abstract class AbstractDbHandler
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
}
