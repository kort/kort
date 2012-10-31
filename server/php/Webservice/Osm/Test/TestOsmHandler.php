<?php
namespace Webservice\Osm\Test;

use TestHelper\KortUnitTestCase;
use Webservice\Osm\OsmHandler;

class TestOsmHandler extends KortUnitTestCase
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
