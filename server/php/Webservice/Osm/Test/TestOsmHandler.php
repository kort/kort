<?php
namespace Webservice\Osm\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\Osm\OsmHandler;

class TestOsmHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestOsmHandler");
    }

    public function testConstruct()
    {
        $hander = new OsmHandler();
        $this->assertIsA($hander, "Webservice\\Osm\\OsmHandler");
    }
}
