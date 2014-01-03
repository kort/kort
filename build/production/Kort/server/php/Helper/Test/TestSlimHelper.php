<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\SlimHelper;
use \Slim\Slim;
use \Mockery as M;

class TestSlimHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestSlimHelper");
        \Slim\Slim::registerAutoloader();
    }

    public function setUp()
    {
        $this->mockApp = M::mock("\\Slim\\Slim");
        $this->mockResponse = M::mock("\\Slim\\Http\\Response");

        $this->slim = new SlimHelper($this->mockApp);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->slim, "Helper\\SlimHelper");
    }

    public function testReturnData()
    {
        $data = array("test" => "data");

        $response = array(
            "return" => $data
        );
        $dataJson = json_encode($data);
        $responseJson = json_encode($response);

        echo $responseJson;

        $this->mockApp->shouldReceive("response")->andReturn($this->mockResponse);
        $this->mockResponse->shouldReceive("write")->with($responseJson);

        $this->slim->returnData($dataJson);
    }
}
