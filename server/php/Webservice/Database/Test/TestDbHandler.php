<?php
namespace Webservice\Bug\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\Bug\BugHandler;
use \Mockery as M;

class TestBugHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestBugHandler");
    }

    public function setUp()
    {
        $this->mockProxy = M::mock('DbProxy');
        $this->handler = new BugHandler();
        $this->handler->setDbProxy($this->mockProxy);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Bug\\BugHandler");
    }

    public function testGetBugsByOwnPosition()
    {
        $this->mockProxy->shouldReceive('setOrderBy')/*->with('/4000/')*/;
        $this->mockProxy->shouldReceive('setLimit')->with(50);
        $this->mockProxy->shouldReceive('getFromDb')->andReturn("{\"test\":\"value\"}");
        $this->assertEqual("{\"test\":\"value\"}", $this->handler->getBugsByOwnPosition(47, 8, 50, 4000));
    }
}
