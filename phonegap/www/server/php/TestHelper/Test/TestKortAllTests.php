<?php
namespace TestHelper\Test;

use TestHelper\AbstractKortUnitTestCase;
use TestHelper\KortAllTests;

class TestKortAllTests extends AbstractKortUnitTestCase
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
