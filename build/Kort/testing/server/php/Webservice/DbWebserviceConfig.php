<?php
namespace Webservice;

/**
 * setup the url path to the db webservice
 */
class DbWebserviceConfig
{
    //protected $url = "http://kort.rdmr.ch/webservices/db";
    protected $url = "http://localhost/kort/server/webservices/db";

    public function getApiKey()
    {
        return getenv('KORT_DB_API_KEY');
    }

     public function getUrl()
    {
        return $this->url;
    }
}
