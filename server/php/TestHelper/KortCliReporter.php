<?php
namespace TestHelper;

class KortCliReporter extends \SimpleReporter {
    public function __construct()
    {
        parent::__construct();
		date_default_timezone_set('UTC');
    }

    public function paintHeader($test_name)
    {
        $this->testsStart = microtime(true);
        print "Starting test suite $test_name (".date('c').")\n";
    }

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

    public function paintCaseStart($case)
    {
        print "- case start $case\n";
        $this->currentCaseName = $case;
    }

    public function paintCaseEnd($case)
    {
        // No output here
    }

    public function paintMethodStart($test)
    {
        print "  - test start: $test";
        $this->methodStart = microtime(true);
    }

    public function paintMethodEnd($test)
    {
        $duration = microtime(true) - $this->methodStart;
        print " (".$duration.")\n";
    }

    public function paintFail($message)
    {
        parent::paintFail($message);
        print "\n\nFAILURES: " . $message ."\n\n";
    }

    public function paintException($exception)
    {
        parent::paintException($exception);
        print "\n\nEXCEPTION: " . $message ."\n\n";
    }

    public function paintError($message)
    {
        parent::paintError($message);
        print "\n\nERROR: " . $message ."\n\n";
    }
}

?>
