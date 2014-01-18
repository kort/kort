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
        $this->mockHttp = M::mock('Helper\HttpHelper');
    }

    public function testGetFromDb()
    {
        $dbProxy = new DbProxy("test_table", array("id", "title"));
        $dbProxy->setHttp($this->mockHttp);
        $this->mockHttp->shouldReceive('get')->andReturn("returnValue");

        $this->assertEqual("returnValue", $dbProxy->select());
    }
}
