<?php

class KortAllTests extends TestSuite {
	protected $reporter;

    function __construct()
    {
        parent::__construct("kort - All tests");
		$this->reporter = new KortHTMLReporter();
    }

	function run($reporter=null)
    {
		parent::run(($reporter == null) ? $this->reporter : $reporter);
	}
}
