<?php
/**
 * kort - TestHelper\KortCliReporter class
 */
namespace TestHelper;

/**
 * The KortCliReporter is a kort-specifc TestReporter which is used when the test
 * are run from command line (CLI).
 */
class KortCliReporter extends \SimpleReporter
{
    /**
     * Creates a new KortCliReporter instance
     */
    public function __construct()
    {
        parent::__construct();
        date_default_timezone_set('UTC');
    }

    /**
     * Paints the header of the test
     * @param string $test_name the name of the test
     */
    public function paintHeader($test_name)
    {
        $this->testsStart = microtime(true);
        print "Starting test suite $test_name (".date('c').")\n";
    }

    /**
     * Paints the footer of the test
     * @param string $test_name the name of the test
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
            print "Tests SUCESSFUL\n";
        } else {
            print "Tests FAILED\n";
        }
    }

    /**
     * Paints the header of the test case
     * @param string $case the name of the test case
     */
    public function paintCaseStart($case)
    {
        print "- case start $case\n";
        $this->currentCaseName = $case;
    }

    /**
     * Paints the footer of the test case
     * @param string $case the name of the test case
     */
    public function paintCaseEnd($case)
    {
        // No output here
    }

    /**
     * Paints the header of the test method
     * @param string $test the name of the test method
     */
    public function paintMethodStart($test)
    {
        print "  - test start: $test";
        $this->methodStart = microtime(true);
    }

    /**
     * Paints the footer of the test method
     * @param string $test the name of the test method
     */
    public function paintMethodEnd($test)
    {
        $duration = microtime(true) - $this->methodStart;
        print " (".$duration.")\n";
    }

    /**
     * Paints a failing test
     * @param string $message the message of the failing test
     */
    public function paintFail($message)
    {
        parent::paintFail($message);
        print "\n\nFAILURES: " . $message ."\n\n";
    }

    /**
     * Paints a test exception
     * @param string $exception the message of the test exception
     */
    public function paintException($exception)
    {
        parent::paintException($exception);
        print "\n\nEXCEPTION: " . $exception ."\n\n";
    }

    /**
     * Paints a test error
     * @param string $message the message of the test error
     */
    public function paintError($message)
    {
        parent::paintError($message);
        print "\n\nERROR: " . $message ."\n\n";
    }
}
