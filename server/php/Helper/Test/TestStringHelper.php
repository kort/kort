<?php
namespace Helper\Test;

class TestStringHelper extends \TestHelper\KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestStringHelper");
    }

    protected static function getClassPaths()
    {
        return dirname(__FILE__)."/../StringHelper.php";
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
