<?php
namespace Helper\Test;

use TestHelper\KortUnitTestCase;

class TestStringHelper extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestStringHelper");
    }

    public function testEndWith()
    {
        $helper = new \Helper\StringHelper();
        $this->assertTrue($helper->endsWith("hello.php", ".php"));
    }

    public function testEndWithBadInput()
    {
        $helper = new \Helper\StringHelper();
        $this->assertFalse($helper->endsWith("Hallo Velo", "la"));
    }
}
