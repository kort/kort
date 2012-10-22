<?php
require_once('../../lib/simpletest/unit_tester.php');
require_once('KortHTMLReporter.php');
require_once('KortCliReporter.php');
/**
 * Description of ReportableUnitTestCase
 *
 * @author odi
 */
abstract class KortUnitTestCase extends UnitTestCase {
	protected $jsonKeys;

	function __construct($label="Kort - Test Case") {
		parent::__construct($label);
	}

	function report()
	{
		$test = new TestSuite($this->getLabel());
		$test->add($this);
		if (TextReporter::inCli())
		{
			exit ($test->run(new KortCliReporter()) ? 0 : 1);
		}
		$test->run(new KortHTMLReporter());
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
