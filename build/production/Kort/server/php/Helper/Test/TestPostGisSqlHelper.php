<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;

class TestPostGisSqlHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestPostGisSqlHelper");
    }

    public function testGetLatLngGeom()
    {
        $helper = new \Helper\PostGisSqlHelper();
        $this->assertEqual("ST_SetSRID(ST_Point(8,47),4326)", $helper->getLatLngGeom(47, 8));
    }
}
