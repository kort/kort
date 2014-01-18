<?php
namespace OAuth\Test;

use TestHelper\AbstractKortUnitTestCase;
use OAuth\OsmOAuth;
use \Mockery as M;
use Kort\ClassLoader;

class TestOsmOAuth extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestOsmOAuth");
    }

    public function setUp()
    {
        $key = "testkey";
        $secret = "testsecret";
        $this->oauth = new OsmOAuth($key, $secret, true);
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->oauth, "OAuth\\OsmOAuth");
    }

    public function testGetSecretFileLocalhost()
    {
        $this->assertEqual("secret_localhost.php", OsmOAuth::getSecretFile("localhost"));
    }

    public function testGetSecretFileKortDev()
    {
        $this->assertEqual("secret_kort-dev.php", OsmOAuth::getSecretFile("kort-dev.herokuapp.com"));
    }

    public function testGetSecretFileKort()
    {
        $this->assertEqual("secret_kort.php", OsmOAuth::getSecretFile("kort.herokuapp.com"));
    }

    public function testGetSecretFileKortWww()
    {
        $this->assertEqual("secret_www.php", OsmOAuth::getSecretFile("www.kort.ch"));
    }

    public function testGetSecretFileKortPlay()
    {
        $this->assertEqual("secret_play.php", OsmOAuth::getSecretFile("play.kort.ch"));
    }
}
