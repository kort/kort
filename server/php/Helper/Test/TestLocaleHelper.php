<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\LocaleHelper;

class TestLocaleHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestLocaleHelper");
    }

    public function testConstruct()
    {
        $reader = new LocaleHelper();
        $this->assertIsA($reader, "Helper\\LocaleHelper");
    }

    public function testGetExistingValue()
    {
        $reader = new LocaleHelper();
        $this->assertEqual($reader->getValue("Test"), "test");
    }

    public function testGetNonExistingValue()
    {
        $reader = new LocaleHelper();
        $this->assertEqual($reader->getValue("blaXXXX"), "blaXXXX");
    }
}
