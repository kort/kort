<?php
namespace Webservice\Statistics\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\DbProxy;
use Webservice\Statistics\StatisticsHandler;
use \Mockery as M;

class TestStatisticsHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestStatisticsHandler");
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
        $this->handler = new StatisticsHandler();
        $this->handler->setDbProxy($this->mockProxy);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Statistics\\StatisticsHandler");
    }

    public function testGetStatistics()
    {
        $statistics = array();
        $statistics['fix_count'] = 3054;

        $statisticsJson = json_encode(array($statistics));

        $this->mockProxy->shouldReceive('select')->andReturn($statisticsJson);
        $this->assertEqual($statisticsJson, $this->handler->getStatistics());
    }
}
