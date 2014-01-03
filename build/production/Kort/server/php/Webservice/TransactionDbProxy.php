<?php
/**
 * kort - Webservice\TransactionDbProxy class
 */
namespace Webservice;

use Webservice\DbProxy;

/**
 * The TransactionDbProxy class runs several statements in one request in one transaction.
 */
class TransactionDbProxy extends DbProxy
{
    /**
     * Statements to run in the transaction.
     *
     * @var array
     */
    protected $statements = array();

    /**
     * Creates a new TransactionDbProxy object.
     */
    public function __construct()
    {
        parent::__construct(null, array());
    }

    /**
     * Makes a request for the whole transaction.
     *
     * @return array array with an entry for each statments result.
     */
    public function sendTransaction()
    {
        $path  = "/transaction";
        $path .= "?";
        $path .= "key=" . $this->getDbWebserviceConfig()->getApiKey();

        $encodedStatements = json_encode($this->statements);
        $result = $this->http->post($this->getDbWebserviceConfig()->getUrl() . $path, $encodedStatements);
        $this->clearTransaction();

        return $result;
    }

    /**
     * Indicates wheter the requests runs in a transaction or not.
     *
     * @return bool true if the request runs in a transation, false otherwise
     */
    public function isTransaction()
    {
        return true;
    }

    /**
     * Removes all statements from this object.
     *
     * @return void
     */
    protected function clearTransaction()
    {
        $this->statements = array();
    }

    /**
     * Adds a new statement as a parameter array to the transaction.
     *
     * @param array $params Parameter object describing the statement to execute.
     *
     * @return the position in the transaction
     */
    public function addToTransaction(array $params)
    {
        $this->statements[] = $params;
        return count($this->statements);
    }
}
