<?php
require_once('../KortUnitTestCase.php');
require_once('../../server/webservices/bug/config.php');

class TestBugWebservice extends KortUnitTestCase
{
	function __construct()
	{
		parent::__construct("kort - TestBugWebservice");
	}

    function testDbWebServiceURL() {
        $config = new Kort\Webservice\DbWebserviceConfig();
        $this->assertEqual($config->url, "http://kort.rdmr.ch/webservices/db");
    }
}
?>
