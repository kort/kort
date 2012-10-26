<?php
namespace TestHelper\Test;

use TestHelper\KortUnitTestCase;
use TestHelper\KortAllTests;

class TestKortAllTests extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestKortAllTests");
    }

    public function testConstruct()
    {
        $tests = new KortAllTests();
        $this->assertIsA($tests, "\\TestHelper\\KortAllTests");
        $this->assertIsA($tests, "\\TestSuite");
    }
}
