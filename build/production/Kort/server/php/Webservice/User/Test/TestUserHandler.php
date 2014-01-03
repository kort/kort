<?php
namespace Webservice\User\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\User\UserHandler;

class TestUserHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestUserHandler");
    }

    public function setUp()
    {
        parent::setup();
        $this->handler = new UserHandler();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\User\\UserHandler");
    }
}
