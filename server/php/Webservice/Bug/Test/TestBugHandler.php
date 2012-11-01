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
        $this->handler = new BugHandler(M::mock('PsqlConnection'));
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Bug\\BugHandler");
    }
}
