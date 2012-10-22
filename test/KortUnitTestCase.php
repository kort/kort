<?php
abstract class KortUnitTestCase extends UnitTestCase {
    public static function autoload($className)
    {
        foreach (static::getClassPaths() as $path) {
            if (substr($path, - strlen(".php")) === ".php") {
                require_once($path);
            } else {
                 require_once($path."/".$className);
            }
        }
    }

    protected static function getClassPaths()
    {
        return array();
    }

	function __construct($label="Kort - Test Case")
    {
		parent::__construct($label);
        spl_autoload_register(__NAMESPACE__ . "\\KortUnitTestCase::autoload");
	}

	function report()
	{
		$test = new TestSuite($this->getLabel());
		$test->add($this);
		if (TextReporter::inCli())
		{
			exit ($test->run(new  \KortCliReporter()) ? 0 : 1);
		}
		$test->run(new KortHTMLReporter());
	}

	function setUp()
    {
		ob_start();
    }

    function tearDown()
    {
        ob_end_flush();
    }

	function getOutput()
	{
		return ob_get_contents();
	}
}

