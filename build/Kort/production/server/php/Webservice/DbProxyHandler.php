<?php
/**
 * kort - Webservice\DbProxyHandler class
 */
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

    /**
     * Returns the table fields used by this handler.
     * @return array the table fields used by this handler.
     */
    abstract protected function getTable();

    /**
     * Returns the table fields used by this handler.
     * @return array the table fields used by this handler.
     */
    abstract protected function getFields();

    protected function insertParams($data, $returnValues = false)
    {
        $params = array();
        $params['table'] = $this->getTable();
        $params['fields'] = $this->getFields();
        $params['returnFields'] = $this->getReturnFields();
        $params['data'] = $data;

        $params['return'] = $returnValues;
        $params['type'] = "INSERT";

        return $params;
    }

    protected function getReturnFields()
    {
        return $this->getFields();
    }
}
