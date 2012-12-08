<?php
namespace Webservice;

use Webservice\DbProxy;

class TransactionDbProxy extends DbProxy
{
    protected $statements = array();

    public function __construct()
    {
        parent::__construct(null, array());
    }

    public function sendTransaction()
    {
        $path  = "/transaction";
        $path .= "?";
        $path .= "key=" . $this->getDbWebserviceConfig()->getApiKey();
        $result = $this->request("POST", $this->getDbWebserviceConfig()->getUrl() . $path, json_encode($this->statements));
        $this->clearTransaction();

        return $result;
    }

    public function isTransaction()
    {
        return true;
    }

    protected function clearTransaction()
    {
        $this->statements = array();
    }

    public function addToTransaction($params)
    {
        $this->statements[] = $params;
    }
}
