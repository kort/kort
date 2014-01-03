<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\PgHelper;
use Kort\ClassLoader;
use \Mockery as M;

class TestPgHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestPgHelper");
        ClassLoader::importClass(dirname(__FILE__), "MockPostgres");
    }

    public function setUp()
    {
        $this->curl = new PgHelper("testdb");
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->curl, "Helper\\PgHelper");
    }
}
