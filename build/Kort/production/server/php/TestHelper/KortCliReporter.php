<?php
/**
 * kort - TestHelper\KortCliReporter class
 */
namespace TestHelper;

/**
 * The KortCliReporter is a kort-specifc TestReporter for the command line (CLI).
 */
class KortCliReporter extends \SimpleReporter
{
    /**
     * Creates a new KortCliReporter instance.
     */
    public function __construct()
    {
        parent::__construct();
        date_default_timezone_set('UTC');
    }

    /**
     * Paints the header of the test.
     *
     * @param string $test_name The name of the test.
     *
     * @return void
     */
    public function paintHeader($test_name)
    {
        $this->testsStart = microtime(true);
        print "Starting test suite $test_name (".date('c').")\n";
    }

    /**
     * Paints the footer of the test.
     *
     * @param string $test_name The name of the test.
     *
     * @return void
     */
    public function paintFooter($test_name)
    {
        print "End of ".$test_name."\n";
        $duration = microtime(true) - $this->testsStart;
        $totalTests = $this->getPassCount() + $this->getFailCount() + $this->getExceptionCount();
        print $totalTests." tests executed.\n";
        print "FAILURES:    ".$this->getFailCount()."\n";
        print "EXCEPTIONS:  ".$this->getExceptionCount()."\n";
        print "Duration:  ".$duration."\n";
        echo "\n";
        if ($totalTests == $this->getPassCount()) {
            print "Tests SUCCESSFUL\n";
        } else {
            print "Tests FAILED\n";
        }
    }

    /**
     * Paints the header of the test case.
     *
     * @param string $case The name of the test case.
     *
     * @return void
     */
    public function paintCaseStart($case)
    {
        print "- case start $case\n";
        $this->currentCaseName = $case;
    }

    /**
     * Paints the footer of the test case.
     *
     * @param string $case The name of the test case.
     *
     * @return void
     */
    public function paintCaseEnd($case)
    {
        // No output here
    }

    /**
     * Paints the header of the test method.
     *
     * @param string $test The name of the test method.
     *
     * @return void
     */
    public function paintMethodStart($test)
    {
        print "  - test start: $test";
        $this->methodStart = microtime(true);
    }

    /**
     * Paints the footer of the test method.
     *
     * @param string $test The name of the test method.
     *
     * @return void
     */
    public function paintMethodEnd($test)
    {
        $duration = microtime(true) - $this->methodStart;
        print " (".$duration.")\n";
    }

    /**
     * Paints a failing test.
     *
     * @param string $message The message of the failing test.
     *
     * @return void
     */
    public function paintFail($message)
    {
        parent::paintFail($message);
        print "\n\nFAILURES: " . $message ."\n\n";
    }

    /**
     * Paints a test exception.
     *
     * @param string $exception The message of the test exception.
     *
     * @return void
     */
    public function paintException($exception)
    {
        parent::paintException($exception);
        print "\n\nEXCEPTION: " . $exception ."\n\n";
    }

    /**
     * Paints a test error.
     *
     * @param string $message The message of the test error.
     *
     * @return void
     */
    public function paintError($message)
    {
        parent::paintError($message);
        print "\n\nERROR: " . $message ."\n\n";
    }
}
