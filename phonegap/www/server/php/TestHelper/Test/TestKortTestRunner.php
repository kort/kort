<?php
namespace TestHelper\Test;

use TestHelper\AbstractKortUnitTestCase;
use TestHelper\KortTestRunner;

class TestKortTestRunner extends AbstractKortUnitTestCase
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
