<?php
namespace Webservice\Fix\Test;

use TestHelper\KortUnitTestCase;
use Webservice\Fix\FixHandler;

class TestFixHandler extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestFixHandler");
    }

    public function testConstruct()
    {
        $hander = new FixHandler();
        $this->assertIsA($hander, "Webservice\\Fix\\FixHandler");
    }
}
