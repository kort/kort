<?php
namespace TestHelper\Test;

use TestHelper\KortUnitTestCase;
use TestHelper\KortTestRunner;

class TestKortTestRunner extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestKortTestRunner");
    }

    public function testConstruct()
    {
        $runner = new KortTestRunner();
        $this->assertIsA($runner, "\\TestHelper\\KortTestRunner");
    }
}
