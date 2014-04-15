<?php
/**
 * kort - Webservice\DbProxyHandler class
 */
namespace Webservice;

use Helper\LocaleHelper;

/**
 * The DbProxyHandler class defines the functionality of a webservice handler.
 *
 * DbProxyHandler relies on the DbProxy to relay it's requests.
 */
abstract class DbProxyHandler
{
    /**
     * The datbase proxy object.
     *
     * @var DbProxy
     */
    private $dbProxy;

    /**
     * The translation helper object.
     *
     * @var LocaleHelper
     */
    private $reader;

    /**
     * Initialized the DbProxyHandler object.
     */
    public function __construct()
    {
        $this->dbProxy = new DbProxy($this->getTable(), $this->getFields());
        $this->reader = new LocaleHelper();
    }

    /**
     * Sets the langauge to which the returns of all request should be translated.
     *
     * @param string $lang The two-character language code.
     *
     * @return void
     */
    public function setLanguage($lang)
    {
        $this->reader = new LocaleHelper($lang);
    }

    /**
     * Setter for $dbProxy.
     *
     * @param DbProxy $proxy New DbProxy object.
     *
     * @return void
     */
    public function setDbProxy(DbProxy $proxy)
    {
        $this->dbProxy = $proxy;
    }

    /**
     * Translate a value to the users language.
     *
     * @param string $key The string to translate.
     *
     * @return string the translated string
     */
    protected function translate($key)
    {
        return $this->reader->getValue($key);
    }

    /**
     * Translate the values of the placeholders and replaced them in the given text.
     *
     * @param array  $data The data of the placeholders.
     * @param string $text The string to translate.
     *
     * @return string the translated text
     */
    protected function translateAndReplacePlaceholder(array $data, $text)
    {
        $search = array("\$1", "\$2", "\$3", "\$4", "\$5");
        $placeholder1 = $this->translate($data['txt1']);
        $placeholder2 = $this->translate($data['txt2']);
        $placeholder3 = $this->translate($data['txt3']);
        $placeholder4 = $this->translate($data['txt4']);
        $placeholder5 = $this->translate($data['txt5']);
        $replace = array($placeholder1, $placeholder2, $placeholder3, $placeholder4, $placeholder5);
        return str_replace($search, $replace, $text);
    }

    /**
     * Getter for $dbProxy.
     *
     * @return DbProxy the dbProxy object
     */
    protected function getDbProxy()
    {
        return $this->dbProxy;
    }

    /**
     * Returns the table name used by this handler.
     *
     * @return string the table name used by this handler
     */
    abstract protected function getTable();

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
    abstract protected function getFields();

    /**
     * Return the returnFields for this handler.
     *
     * @return array database table fields
     */
    protected function getReturnFields()
    {
        return $this->getFields();
    }

    /**
     * Returns a parameter object to insert $data in a transaction.
     *
     * @param array $data Data to insert.
     *
     * @return array the parameter object for the request
     */
    protected function insertParams(array $data)
    {
        $params = array();
        $params['table'] = $this->getTable();
        $params['fields'] = $this->getFields();
        $params['returnFields'] = $this->getReturnFields();
        $params['data'] = $data;

        $params['type'] = "INSERT";

        return $params;
    }
}
