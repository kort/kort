<?php
namespace Webservice\Database;

abstract class AbstractDbHandler
{
    protected $db;

    public function __construct()
    {
        $this->db = new PsqlHelper(new DbConfig());
    }
}
