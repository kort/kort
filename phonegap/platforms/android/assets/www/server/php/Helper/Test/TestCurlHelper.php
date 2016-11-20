<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\CurlHelper;
use \Mockery as M;

class TestCurlHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestCurlHelper");
    }

    public function setUp()
    {
        $this->curl = new CurlHelper();
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->curl, "Helper\\CurlHelper");
    }
}
