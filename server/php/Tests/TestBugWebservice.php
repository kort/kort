<?php
namespace Tests;

class TestBugWebservice extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestBugWebservice");
    }

     protected static function getClassPaths()
    {
        return "..";
    }

    public function testDbWebServiceURL()
    {
        $config = new \Webservice\DbWebserviceConfig();
        $this->assertEqual($config->url, "http://kort.rdmr.ch/webservices/db");
    }
}
