<?php
namespace Webservice\Test;

use TestHelper\KortUnitTestCase;
use Webservice\DbWebserviceConfig;

class TestBugWebservice extends KortUnitTestCase
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
        $config = new DbWebserviceConfig();
        $this->assertEqual($config->url, "http://kort.rdmr.ch/webservices/db");
    }
}
