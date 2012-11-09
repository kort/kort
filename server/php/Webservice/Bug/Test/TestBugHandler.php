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

    public function testGetBugsByOwnPosition()
    {
        $this->dbConn
                ->shouldReceive('doSelectQuery')
                ->once()
                ->with(typeOf('array'), typeOf('string'), typeOf('string'), "ST_Distance(ST_SetSRID(ST_Point(8,47),4326),geom)", 50)
                ->andReturn(array("test" => "value"));
        $this->assertEqual("{\"test\":\"value\"}", $this->handler->getBugsByOwnPosition(47, 8, 50));
    }
}
