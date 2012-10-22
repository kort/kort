<?php
namespace Kort\Tests;

use Kort\Webservice\DbWebserviceConfig;

class TestBugWebservice extends \KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestBugWebservice");
    }
    protected static function getClassPaths()
    {
        return array(dirname(__FILE__)."/../../server/webservices/bug/config.php");
    }

    public function testDbWebServiceURL()
    {
        $config = new DbWebserviceConfig();
        $this->assertEqual($config->url, "http://kort.rdmr.ch/webservices/db");
    }
}
