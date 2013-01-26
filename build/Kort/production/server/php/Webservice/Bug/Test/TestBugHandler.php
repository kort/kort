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
        $this->mockProxy = M::mock('Webservice\TransactionDbProxy');
        $this->handler = new BugHandler();
        $this->handler->setLanguage("de");
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
        $bug['description'] = "bug.question.poi";
        $bug['txt1'] = "cafe";
        $bug['txt2'] = "";
        $bug['txt3'] = "";
        $bug['txt4'] = "";
        $bug['txt5'] = "";
        $bug['title'] = "Objekt ohne Namen";
        $bug['answer_placeholder'] = "Name";

        $translatedBug = array();
        $translatedBug['description'] = "Wie heisst diese/s Café?";
        $translatedBug['txt1'] = $bug['txt1'];
        $translatedBug['txt2'] = $bug['txt2'];
        $translatedBug['txt3'] = $bug['txt3'];
        $translatedBug['txt4'] = $bug['txt4'];
        $translatedBug['txt5'] = $bug['txt5'];
        $translatedBug['title'] = "Objekt ohne Namen";
        $translatedBug['answer_placeholder'] = "Name";

        $this->mockProxy->shouldReceive('addToTransaction')->andReturn(1);
        $this->mockProxy->shouldReceive('sendTransaction')->andReturn(json_encode(array(array($bug))));

        $this->assertEqual(json_encode(array($translatedBug)), $this->handler->getBugsByOwnPosition(47, 8, 50, 4000));
    }
}
