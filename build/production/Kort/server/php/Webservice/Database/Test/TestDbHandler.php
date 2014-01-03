<?php
namespace Webservice\Database\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\Database\DbHandler;
use \Mockery as M;

class TestDbHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestDbHandler");
    }

    public function setUp()
    {
        $this->mockDb = M::mock('Webservice\Database\PsqlConnection');
        $this->handler = new DbHandler($this->mockDb);

        $this->fields = array("id", "title");
        $this->table = "schema.testtable";
        $this->where = "id = 7";
        $this->orderBy = "title desc";
        $this->limit = 10;
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\Database\\DbHandler");
    }

    public function testDoSelect()
    {
        $this->mockDb->shouldReceive('doSelectQuery')->andReturn(array("id" => 7, "title" => "A test title"));
        $resultJson = $this->handler->doSelect(
            $this->fields,
            $this->table,
            $this->where,
            $this->orderBy,
            $this->limit
        );

        $result = json_decode($resultJson, true);
        $this->assertEqual(json_last_error(), JSON_ERROR_NONE, "Result should be valid JSON");
        $this->assertEqual(7, $result['id'], "ID should equal the input");
        $this->assertEqual("A test title", $result['title'], "Title should equal the input");
    }

    public function testDoSelectEmpty()
    {
        $this->mockDb->shouldReceive('doSelectQuery')->andReturn(array());
        $resultJson = $this->handler->doSelect(
            $this->fields,
            $this->table,
            $this->where,
            $this->orderBy,
            $this->limit
        );

        $this->assertEqual("", $resultJson, "If the return is empty no JSON should be returned, empty string instead.");
    }
}
