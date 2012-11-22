<?php
namespace Webservice;

abstract class DbProxyHandler
{
    private $dbProxy;
    protected $table;
    protected $fields;

    public function __construct()
    {
        $this->dbProxy = new DbProxy($this->table, $this->fields);
    }

    protected function getDbProxy()
    {
        return $this->dbProxy;
    }

    //used for unit testing
    public function setDbProxy($proxy)
    {
        $this->dbProxy = $proxy;
    }
}
