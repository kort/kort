<?php
/**
 * kort - Webservice\TransactionDbProxy class
 */
namespace Webservice;

use Webservice\DbProxy;

/**
 * The TransactionDbProxy class is a special DbProxy which runs several statements
 * in one request in one transaction
 */
class TransactionDbProxy extends DbProxy
{
    /** @var array the different statements to run in the transaction */
    protected $statements = array();

    /**
     * Creates a new TransactionDbProxy object
     */
    public function __construct()
    {
        parent::__construct(null, array());
    }

    /**
     * Makes a request for the whole transaction
     * @return array array with an entry for each statments result.
     */
    public function sendTransaction()
    {
        $path  = "/transaction";
        $path .= "?";
        $path .= "key=" . $this->getDbWebserviceConfig()->getApiKey();

        $encodedStatements = json_encode($this->statements);
        $result = $this->request("POST", $this->getDbWebserviceConfig()->getUrl() . $path, $encodedStatements);
        $this->clearTransaction();

        return $result;
    }

    /**
     * Indicates wheter the requests runs in a transaction or not
     * @return bool true if the request runs in a transation, false otherwise
     */
    public function isTransaction()
    {
        return true;
    }

    /**
     * Removed all statements from this object
     */
    protected function clearTransaction()
    {
        $this->statements = array();
    }

    /**
     * Adds a new statement as a parameter array to the transaction
     * @param array $params a parameter object describing the statement to execute
     */
    public function addToTransaction($params)
    {
        $this->statements[] = $params;
    }
}
