<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\SecretGenerator;
use \Mockery as M;

class TestSecretGenerator extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestSecretGenerator");
    }

    public function setUp()
    {
        $this->gen = new SecretGenerator();
    }

    public function tearDown()
    {
        M::close();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->gen, "Helper\\SecretGenerator");
    }

    public function testGetSecret()
    {
        $this->assertNotEmpty($this->gen->getSecret());
    }
}
