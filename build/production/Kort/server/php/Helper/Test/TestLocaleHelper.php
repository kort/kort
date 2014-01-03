<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\LocaleHelper;

class TestLocaleHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        $this->locale = new LocaleHelper("de_CH", \dirname(__FILE__) . "/translationTest.props");
        parent::__construct("kort - TestLocaleHelper");
    }

    public function testConstruct()
    {
        $reader = new LocaleHelper();
        $this->assertIsA($reader, "Helper\\LocaleHelper");
    }

    public function testGetExistingValue()
    {

        $this->assertEqual($this->locale->getValue("Test"), "test");
    }

    public function testGetNonExistingValue()
    {
        $this->assertEqual($this->locale->getValue("blaXXXX"), "blaXXXX");
    }

    public function testDollarValue()
    {
        $this->assertEqual($this->locale->getValue("test mit \$1 dollar"), "dollar \$2");
    }

    public function testQuoteValue()
    {
        $this->assertEqual($this->locale->getValue("that's 'it=12' for me"), "something");
    }

    public function testUrlValue()
    {
        $this->assertEqual($this->locale->getValue("url"), "http://www.google.com/?q=test");
    }

    public function testPercentValue()
    {
        $this->assertEqual($this->locale->getValue("hallo %1"), "Hi %1");
    }
}
