<?php
namespace Webservice\Answer\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\DbProxy;
use Webservice\Answer\AnswerHandler;
use \Mockery as M;

class TestAnswerHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestAnswerHandler");
    }

    public function setUp()
    {
        $this->mockProxy = M::mock(
            'Webservice\DbProxy',
            array(
                "setLimit" => null,
                "setOrderBy" => null,
                "setWhere" => null
            )
        );
        $this->handler = new AnswerHandler();
        $this->handler->setDbProxy($this->mockProxy);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Answer\\AnswerHandler");
    }

    public function testGetSpecificAnswers()
    {
        $answer = array();
        $answer['title'] = "Test";

        $answerJson = json_encode(array($answer));

        $this->mockProxy->shouldReceive('select')->andReturn($answerJson);
        $this->assertEqual($answerJson, $this->handler->getSpecificAnswers("some_type", 1));
    }
}
