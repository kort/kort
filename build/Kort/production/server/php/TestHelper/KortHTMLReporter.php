<?php
/**
 * kort - TestHelper\KortHTMLReporter class
 */
namespace TestHelper;

/**
 * The KortHTMLReporter class is a kort-specific implementation of a HTML reporter
 * for SimpleTest. It defines how tests should be painted.
 */
class KortHTMLReporter extends \HtmlReporter
{
    /**
     * Paints a passing test
     * @param string $message the message of the passed test
     */
    public function paintPass($message)
    {
        parent::paintPass($message);
        print "<span class=\"pass\">Pass</span>: ";
        $breadcrumb = $this->getTestList();
        array_shift($breadcrumb);
        print implode("->", $breadcrumb);
        print "->$message<br />\n";
    }

    /**
     * Paints a header for the test case.
     * @param string $test_name the name of the test
     */
    public function paintHeader($test_name)
    {
        print "<h2>$test_name</h2>\n";
        flush();
    }
}
