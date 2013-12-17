<?php
namespace Webservice\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\DbWebserviceConfig;

class TestDbWebserviceConfig extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestDbWebserviceConfig");
    }

    public function testDbWebServiceUrl()
    {
        $config = new DbWebserviceConfig();
        $this->assertEqual($config->getUrl(), "http://kort.sourcepole.ch/db");
    }
}
