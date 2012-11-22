<?php
namespace Webservice\Fix\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\Fix\FixHandler;

class TestFixHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestFixHandler");
    }

    public function setUp()
    {
        $this->handler = new FixHandler();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Fix\\FixHandler");
    }
}
