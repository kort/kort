<?php

namespace TestHelper\Test;

use TestHelper\KortUnitTestCase;
use TestHelper\KortHTMLReporter;

class TestKortHTMLReporter extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestKortHTMLReporter");
    }

    public function testConstruct()
    {
        $reporter = new KortHTMLReporter();
        $this->assertIsA($reporter, "\\TestHelper\\KortHTMLReporter");
        $this->assertIsA($reporter, "\\HTMLReporter");
    }
}
