<?php
namespace TestHelper;

use Helper\StringHelper;

abstract class AbstractKortUnitTestCase extends \UnitTestCase
{
    public function __construct($label = "Kort - Test Case")
    {
        parent::__construct($label);
    }

    public function report()
    {
        $test = new \TestSuite($this->getLabel());
        $test->add($this);
        if (\TextReporter::inCli()) {
            exit ($test->run(new  KortCliReporter()) ? 0 : 1);
        }
        $test->run(new KortHTMLReporter());
    }

    public function setUp()
    {
        ob_start();
    }

    public function tearDown()
    {
        ob_end_flush();
    }

    public function getOutput()
    {
        return ob_get_contents();
    }
}
