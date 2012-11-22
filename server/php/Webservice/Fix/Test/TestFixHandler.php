<?php
namespace Webservice\Fix\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\Fix\FixHandler;
use \Mockery as M;

class TestFixHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestFixHandler");
    }

    public function setUp()
    {
        $this->mockProxy = M::mock('DbProxy');
        $this->handler = new FixHandler();
        $this->handler->setDbProxy($this->mockProxy);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Fix\\FixHandler");
    }

    public function testInsertFix()
    {
        $data = array("test" => "data");
        $this->mockProxy->shouldReceive('postToDb');
        $this->assertNull($this->handler->insertFix($data));
    }
}
