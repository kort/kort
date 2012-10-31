<?php
namespace Webservice\Fix\Test;

use TestHelper\KortUnitTestCase;
use Webservice\Fix\FixHandler;
use \Mockery as M;

class TestFixHandler extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestFixHandler");
    }

    public function setUp()
    {
        $this->handler = new FixHandler(M::mock('PsqlConnection'));
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Fix\\FixHandler");
    }
}
