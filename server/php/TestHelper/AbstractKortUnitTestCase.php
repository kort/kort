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
     * Sets up a unit test case with variables, resources, data etc.
     *
     * This method is typically overridden by it's subclass. If you want to use
     * the getOutput() functionality, you should make sure to call this method in
     * your own setUp() method using parent::setUp()
     *
     * @return void
     */
    public function setUp()
    {
        ob_start();
    }

    /**
     * Cleans up after each unit test case.
     *
     * This method is typically overridden by it's subclass. If you want to use
     * the getOutput() functionality, you should make sure to call this method in
     * your own tearDown() method using parent::tearDown()
     *
     * @return void
     */
    public function tearDown()
    {
        ob_end_flush();
    }

    /**
     * Returns the printed output of a test.
     *
     * Works only if setUp() and tearDown() have been used
     *
     * @return saved output of the test
     */
    public function getOutput()
    {
        return ob_get_contents();
    }
}
