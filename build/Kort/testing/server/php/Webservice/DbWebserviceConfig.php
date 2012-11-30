<?php
namespace Webservice;

/**
 * setup the url path to the db webservice
 */
class DbWebserviceConfig
{
    //public $url = "http://kort.rdmr.ch/webservices/db";
    public $url = "http://localhost/kort/server/webservices/db";

    public function getApiKey()
    {
        return getenv('KORT_DB_API_KEY');
    }
}
