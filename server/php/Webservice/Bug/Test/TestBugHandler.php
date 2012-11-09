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
        $this->dbConn = M::mock('PsqlConnection');
        $this->handler = new BugHandler($this->dbConn);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Bug\\BugHandler");
    }

    public function testGetBugsById()
    {
        $this->dbConn
                ->shouldReceive('doSelectQuery')
                ->once()
                ->with("schema = '95' and id = 123")
                ->andReturn(array(array("test" => "value")));
        $this->assertEqual("{\"test\":\"value\"}", $this->handler->getBugsByid(95, 123));
    }

    public function testGetBugsByOwnPosition()
    {
        $this->dbConn
                ->shouldReceive('doSelectQuery')
                ->once()
                ->with(typeOf('string'), "ST_Distance(ST_SetSRID(ST_Point(8,47),4326),geom)", typeOf('integer'))
                ->andReturn(array("test" => "value"));
        $this->assertEqual("{\"test\":\"value\"}", $this->handler->getBugsByOwnPosition(47, 8, 50));
    }
}
