<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\HttpHelper;
use \Mockery as M;

class TestHttpHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestHttpHelper");
    }

    public function setUp()
    {
        $this->http = new HttpHelper();
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->http, "Helper\\HttpHelper");
    }

    public function testGet()
    {
        $page = $this->http->get("http://rotatingvietnameseshamewheel.com/");
        $this->assertNotEmpty($page, "HTTP GET should not return empty page");
    }
}
