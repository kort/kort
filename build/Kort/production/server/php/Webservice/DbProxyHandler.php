<?php
/**
 * kort - Webservice\DbProxyHandler class
 */
namespace Webservice;

use Helper\LocaleHelper;

/**
 * The DbProxyHandler class defines the functionality of a webservice handler,
 * which uses the DbProxy to relay it's requests.
 */
abstract class DbProxyHandler
{
    /** @var DbProxy the datbase proxy object */
    private $dbProxy;
    /** @var LocaleHelper the translation helper object */
    private $reader;

    /**
     * Initialized the DbProxyHandler object
     */
    public function __construct()
    {
        $this->dbProxy = new DbProxy($this->getTable(), $this->getFields());
        $this->reader = new LocaleHelper("de_CH");
    }

    /**
     * Setter for $dbProxy (only used for unit tests)
     * @param DbProxy $proxy a new DbProxy object
     */
    public function setDbProxy($proxy)
    {
        $this->dbProxy = $proxy;
    }

    /**
     * Translate a value to the users language
     * @param string $key the string to translate
     * @return string the translated string
     */
    protected function translate($key)
    {
        return $this->reader->getValue($key);
    }

    /**
     * Getter for $dbProxy
     * @return DbProxy the dbProxy object
     */
    protected function getDbProxy()
    {
        return $this->dbProxy;
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

    /**
     * Return the returnFields for this handler
     * @return array database table fields
     */
    protected function getReturnFields()
    {
        return $this->getFields();
    }

    /**
     * Returns a parameter object to insert $data in a transaction
     * @param array $data data to insert
     * @param array $returnValues fields to return from the request
     * @return array the parameter object for the request
     */
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
}
