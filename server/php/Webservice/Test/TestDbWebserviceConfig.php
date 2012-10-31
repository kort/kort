<?php
namespace Webservice\Test;

use TestHelper\KortUnitTestCase;
use Webservice\DbWebserviceConfig;

class TestDbWebserviceConfig extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestDbWebserviceConfig");
    }

    public function testDbWebServiceURL()
    {
        $config = new DbWebserviceConfig();
        $this->assertEqual($config->url, "http://kort.rdmr.ch/webservices/db");
    }
}
