<?php
/**
 * kort - TestHelper\KortAllTests class
 */
namespace TestHelper;

/**
 * The KortAllTests is a TestSuite that contains all tests of the project.
 */
class KortAllTests extends \TestSuite
{
    /**
     * The reporter instance to use for displaying the tests.
     *
     * @var SimpleReporter
     */
    protected $reporter;

    /**
     * Create a new KortAllTest test suite.
     */
    public function __construct()
    {
        parent::__construct("kort - All tests");
        $this->reporter = new KortHTMLReporter();
    }

    /**
     * Runs all tests that have previouly been added to the suite.
     *
     * @param mixed $reporter Reporter instance to use to display the test results.
     *
     * @return void
     */
    public function run($reporter = null)
    {
        parent::run(($reporter == null) ? $this->reporter : $reporter);
    }
}
