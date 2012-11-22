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
        $this->mockDb = M::mock('PgHelper');
        $this->psql = new PsqlConnection(array(), $this->mockDb);

        $this->fields = array("id", "title");
        $this->table = "schema.testtable";
        $this->where = "id = 3";
        $this->orderBy = "title desc";
        $this->limit = 10;

        $this->return = array("id" => 3, "sorting" => 1);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testDoSelectQuery()
    {
        $sql = "SELECT id,title FROM schema.testtable WHERE id = 3 ORDER BY title desc LIMIT 10;";
        $this->mockDb->shouldReceive('query')->with($sql)->andReturn($this->return);
        $result = $this->psql->doSelectQuery($this->fields, $this->table, $this->where, $this->orderBy, $this->limit);

        $this->assertEqual($this->return, $result, "The result should match with the input");
    }
}
