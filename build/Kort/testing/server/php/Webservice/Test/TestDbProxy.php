<?php
namespace Webservice\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\DbProxy;

class TestDbProxy extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestDbProxy");
    }

    public function testGetFromDb()
    {
        $dbProxy = new DbProxy("table", array("id", "title"));

    }
}
