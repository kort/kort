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
            'DbProxy',
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
        $this->mockProxy->shouldReceive('select')->andReturn("{\"test\":\"value\"}");
        $this->assertEqual("{\"test\":\"value\"}", $this->handler->getSpecificAnswers("some_type", 1));
    }

    public function testGetSpecificAnswersEmpty()
    {
        $this->mockProxy->shouldReceive('select')->andReturn("");
        $this->assertEqual("", $this->handler->getSpecificAnswers("some_type", 1));
    }
}
