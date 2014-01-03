<?php
/**
 * kort - Webservice\DbWebserviceConfig class
 */
namespace Webservice;

/**
 * Setup the url path to the db webservice.
 */
class DbWebserviceConfig
{
    /**
     * The URL of the database webservice.
     *
     * @var string
     */
    protected $url = "http://kort.sourcepole.ch/db";

    /**
     * Getter for the API key (which must be set in the environment.
     *
     * @return string the API key
     */
    public function getApiKey()
    {
        return getenv('KORT_DB_API_KEY');
    }

    /**
     * Getter for $url.
     *
     * @return string the url of the database webservice
     */
    public function getUrl()
    {
        return $this->url;
    }
}
