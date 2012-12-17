<?php
/**
 * kort - TestHelper\AbstractKortUnitTestCase class
 */
namespace TestHelper;

use Helper\StringHelper;

/**
 * The AbstractKortUnitTestCase class is the kort-specific sub-class of UnitTestCase.
 *
 * It takes care of the correct labeling and the test output.
 *
 * It is recommended that all test classes in this project are subclasses of this
 * class. This ensures that they can be run together easily.
 */
abstract class AbstractKortUnitTestCase extends \UnitTestCase
{
    /**
     * Create a new UnitTestCase with a label.
     *
     * @param string $label Label for the test case.
     */
    public function __construct($label = "Kort - Test Case")
    {
        parent::__construct($label);
    }

    /**
     * Genereates a nice report of the test.
     *
     * It instantiate a SimpleTest TestSuite and launches a Reporter.
     * This method is typically called by a TestRunner.
     *
     * @return void
     * @see    KortTestRunner
     * @see    KortCliReporter
     * @see    KortHTMLReporter
     */
    public function report()
    {
        $test = new \TestSuite($this->getLabel());
        $test->add($this);
        if (\TextReporter::inCli()) {
            exit ($test->run(new  KortCliReporter()) ? 0 : 1);
        }
        $test->run(new KortHTMLReporter());
    }

    /**
     * Passes if the given $value is empty.
     *
     * @param mixed  $value   Value to check for it's emptiness.
     * @param string $message Message to display describing the test state.
     *
     * @return boolean True on pass
     */
    public function assertEmpty($value, $message = "")
    {
        return $this->assertTrue(empty($value), $message);
    }

    /**
     * Passes if the given $value is not empty.
     *
     * @param mixed  $value   Value to check for it's emptiness.
     * @param string $message Message to display describing the test state.
     *
     * @return boolean True on pass
     */
    public function assertNotEmpty($value, $message = "")
    {
        return $this->assertTrue(!empty($value), $message);
    }
}
