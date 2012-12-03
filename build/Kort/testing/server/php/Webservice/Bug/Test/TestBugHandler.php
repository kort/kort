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
        $bug = array();
        $bug['description'] = "This node is tagged as \$1 and therefore needs a name tag or an operator tag";
        $bug['txt1'] = "cafe";
        $bug['txt2'] = "";
        $bug['txt3'] = "";
        $bug['txt4'] = "";
        $bug['txt5'] = "";

        $translatedBug = array();
        $translatedBug['description'] = "Dieser Ort ist als Café markiert und benötigt deshalb einen Namen";
        $translatedBug['txt1'] = $bug['txt1'];
        $translatedBug['txt2'] = $bug['txt2'];
        $translatedBug['txt3'] = $bug['txt3'];
        $translatedBug['txt4'] = $bug['txt4'];
        $translatedBug['txt5'] = $bug['txt5'];

        $this->mockProxy->shouldReceive('setOrderBy');
        $this->mockProxy->shouldReceive('setLimit')->with(50);
        $this->mockProxy->shouldReceive('select')->andReturn(json_encode(array($bug)));
        $this->assertEqual(json_encode(array($translatedBug)), $this->handler->getBugsByOwnPosition(47, 8, 50, 4000));
    }
}
