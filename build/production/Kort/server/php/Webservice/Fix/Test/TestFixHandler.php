<?php
namespace Webservice\Fix\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\Fix\FixHandler;
use \Mockery as M;

class TestFixHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestFixHandler");
    }

    public function setUp()
    {
        $this->mockProxy = M::mock('Webservice\TransactionDbProxy');
        $this->handler = new FixHandler($this->mockProxy);

        $this->sendTransResult = array();
        $this->sendTransResult[0] = array(
            "user_id"  => 0,
            "error_id" => 976576,
            "schema"   => "95",
            "osm_id"   => 898213791823,
            "message"  => "grade4"
        );
        $this->sendTransResult[1][0] = array(
            "koin_count_total" => 260,
            "koin_count_new"   => 5
        );
        $this->sendTransResult[2] = array();
        $this->sendTransResult[3][0] = array(
            "badge_id" => 10,
            "create_date" => "2012-12-13 00:22:12.300417"
        );
        $this->sendTransResult[4] = array();

        $this->sendTransResultJson = json_encode($this->sendTransResult);

        $this->reward = array();
        $this->reward["badges"][] = array(
            "name" => "fix_count_1"
        );
        $this->reward["koin_count_new"] = 5;
        $this->reward["koin_count_total"] = 260;
        $this->rewardJson = json_encode($this->reward);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Fix\\FixHandler");
    }

    public function testInsertFix()
    {
        $data = array(
            "test" => "data",
            "user_id" => 0,
            "error_id" => 976576,
            "schema" => "95",
            "osm_id" => 898213791823
        );


        $this->mockProxy->shouldReceive('addToTransaction')->andReturn(1)->once();
        $this->mockProxy->shouldReceive('addToTransaction')->andReturn(2)->once();
        $this->mockProxy->shouldReceive('addToTransaction')->andReturn(3)->once();
        $this->mockProxy->shouldReceive('addToTransaction')->andReturn(4)->once();
        $this->mockProxy->shouldReceive('addToTransaction')->andReturn(5)->once();

        $this->mockProxy->shouldReceive('sendTransaction')->once()->andReturn($this->sendTransResultJson);
        $this->assertEqual($this->rewardJson, $this->handler->insertFix($data));
    }
}
