<?php
namespace Webservice\Test;

class TestBugWebservice extends \TestHelper\KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestBugWebservice");
    }

     protected static function getClassPaths()
    {
        return dirname(__FILE__)."/../DbWebserviceConfig.php";
    }

    public function testDbWebServiceURL()
    {
        $config = new \Webservice\DbWebserviceConfig();
        $this->assertEqual($config->url, "http://kort.rdmr.ch/webservices/db");
    }
}
