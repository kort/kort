<?php
require_once('../../lib/simpletest/test_case.php');
require_once('KortHTMLReporter.php');

/**
 * Description of AllTests
 *
 * @author odi
 */
class AllTests extends TestSuite {
	protected $reporter;
    function __construct() {
        parent::__construct("kort - All tests");
		$this->reporter = new KortHTMLReporter();
    }

	function run($reporter=null) {
		parent::run(($reporter == null) ? $this->reporter : $reporter);
	}
}

?>
