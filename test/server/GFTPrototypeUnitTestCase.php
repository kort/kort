<?php
require_once(dirname(__FILE__) . '/lib/simpletest/unit_tester.php');
require_once('GFTPrototypeHTMLReporter.php');
require_once('JUnitXMLReporter.php');
/**
 * Description of ReportableUnitTestCase
 *
 * @author odi
 */
abstract class GFTPrototypeUnitTestCase extends UnitTestCase {
	protected $jsonKeys;
	
	function __construct($label="GFTPrototype - Test Case") {
		parent::__construct($label);
	}
	
	function report() 
	{
		$test = new TestSuite($this->getLabel());
		$test->add($this);
		if (TextReporter::inCli()) 
		{
			exit ($test->run(new JUnitXMLReporter()) ? 0 : 1);
		} 
		$test->run(new GFTPrototypeHTMLReporter());
	}
	
	function setUp() {
		ob_start();
    }

    function tearDown() {
        ob_end_flush();
    }
	
	function getOutput()
	{
		return ob_get_contents();
	}
}

?>
