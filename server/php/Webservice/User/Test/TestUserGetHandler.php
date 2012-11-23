<?php
namespace Webservice\User\Test;

use TestHelper\AbstractKortUnitTestCase;
use Webservice\User\UserGetHandler;

class TestUserGetHandler extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestUserGetHandler");
    }

    public function setUp()
    {
        parent::setup();
        $this->handler = new UserHandler();
    }

    public function testConstruct()
    {
        $this->assertIsA($this->handler, "Webservice\\User\\UserGetHandler");
    }
}
