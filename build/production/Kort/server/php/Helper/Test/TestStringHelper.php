<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;

class TestStringHelper extends AbstractKortUnitTestCase
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

    public function testStartsWith()
    {
        $helper = new \Helper\StringHelper();
        $this->assertTrue($helper->startsWith("hello.php", "hell"));
    }

    public function testStartsWithBadInput()
    {
        $helper = new \Helper\StringHelper();
        $this->assertFalse($helper->endsWith("Hello World", "Wo"));
    }
}
