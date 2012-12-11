<?php

namespace Webservice\Database\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\Database\PsqlConnection;
use \Mockery as M;

class TestPsqlConnection extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestPsqlConnection");
    }

    public function setUp()
    {
        $this->mockDb = M::mock(
            'Helper\PgHelper',
            array(
                "close" => null,
            )
        );
        $mockConfig = M::mock('Webservice\Database\DbConfig');
        $this->psql = new PsqlConnection($mockConfig, $this->mockDb);

        $this->fields = array("id", "title");
        $this->table = "schema.testtable";
        $this->where = "id = 3";
        $this->orderBy = "title desc";
        $this->limit = 10;
    }

    public function tearDown()
    {
        M::close();
    }

    public function testDoSelectQuery()
    {
        $expectedResult = array("id" => 3, "sorting" => 1);
        $sql = "SELECT id,title FROM schema.testtable WHERE id = 3 ORDER BY title desc LIMIT 10;";
        $this->mockDb->shouldReceive('query')->with($sql)->andReturn($expectedResult);
        $result = $this->psql->doSelectQuery($this->fields, $this->table, $this->where, $this->orderBy, $this->limit);

        $this->assertTrue(is_array($result), "The result should be an array");
        $this->assertEqual($expectedResult, $result, "The result should match with the input");
    }

    public function testDoUpdateQuery()
    {
        $data = array("title" => "test title", "sorting" => 99);
        $sql = "UPDATE schema.testtable set title = $1,sorting = $2 WHERE id = 3 RETURNING id,title;";
        $this->mockDb->shouldReceive('prepare')->with("update-kort", $sql);
        $this->mockDb->shouldReceive('execute')->with("update-kort", array("test title", 99));
        $this->mockDb->shouldReceive('fetchRow')->andReturn($data);
        $result = $this->psql->doUpdateQuery($data, $this->table, $this->where, $this->fields);

        $this->assertTrue(is_array($result), "The result should be an array");
        $this->assertEqual($data, $result, "The result should match with the input");
    }
}
