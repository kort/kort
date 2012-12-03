<?php
namespace Webservice;

use Helper\LocaleHelper;

abstract class DbProxyHandler
{
    private $dbProxy;
    private $reader;

    public function __construct()
    {
        $this->dbProxy = new DbProxy($this->getTable(), $this->getFields());
        $this->reader = new LocaleHelper("de_CH");
    }

    protected function getDbProxy()
    {
        return $this->dbProxy;
    }

    protected function translate($key)
    {
        return $this->reader->getValue($key);
    }

    //used for unit testing
    public function setDbProxy($proxy)
    {
        $this->dbProxy = $proxy;
    }

    abstract protected function getFields();
    abstract protected function getTable();
}
