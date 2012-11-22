<?php
namespace Webservice\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\DbProxy;
use \Mockery as M;

class TestDbProxy extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestDbProxy");
        $this->mockCurl = M::mock('CurlHelper');
    }

    public function testGetFromDb()
    {
        $dbProxy = new DbProxy("test_table", array("id", "title"));
        $dbProxy->setCurl($this->mockCurl);

        $this->mockCurl->shouldReceive('setOption');
        $this->mockCurl->shouldReceive('execute')
                ->andReturn("returnValue");
        $this->mockCurl->shouldReceive('close');

        $this->assertEqual("returnValue", $dbProxy->getFromDb());

    }
}
