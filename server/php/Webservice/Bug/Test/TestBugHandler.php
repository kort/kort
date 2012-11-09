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

     public function getBugsByOwnPosition()
    {
        $this->dbConn->shouldReceive('doSelectQuery')->andReturn(10, 12, 14);
        $this->handler->getBugsByOwnPosition(47, 8);
    }
}
