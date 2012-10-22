<?php
require_once('lib/simpletest/reporter.php');

class GFTPrototypeHTMLReporter extends HtmlReporter {
    
    function paintPass($message) 
	{
        parent::paintPass($message);
        print "<span class=\"pass\">Pass</span>: ";
        $breadcrumb = $this->getTestList();
        array_shift($breadcrumb);
        print implode("->", $breadcrumb);
        print "->$message<br />\n";
    }
	
	function paintHeader($test_name) {
        print "<h2>$test_name</h2>\n";
        flush();
    }
}

?>
