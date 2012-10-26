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

    public function testDbWebServiceURL()
    {
        $config = new DbWebserviceConfig();
        $this->assertEqual($config->url, "http://kort.rdmr.ch/webservices/db");
    }
}
