<?php
namespace Webservice;

abstract class DbProxyHandler
{
    private $dbProxy;

    public function __construct()
    {
        $this->dbProxy = new DbProxy($this->getTable(), $this->getFields());
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

    abstract protected function getFields();
    abstract protected function getTable();
}
