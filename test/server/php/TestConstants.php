<?php
require_once(dirname(__FILE__) . '/../GFTPrototypeUnitTestCase.php');
require_once(dirname(__FILE__) . '/../../lib/fusion-tables-client-php/constants.php');

class TestConstants extends GFTPrototypeUnitTestCase 
{
	function __construct() 
	{
		parent::__construct("GFTPrototype - TestConstants");
	}
	
    function testURL() {
        $this->assertEqual(URL, "https://www.google.com/fusiontables/api/query");
    }
}
?>
