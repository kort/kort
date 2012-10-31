<?php

namespace Webservice\Bug\Test;

use TestHelper\KortUnitTestCase;
use Webservice\Bug\BugHandler;

class TestBugHandler extends KortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestBugHandler");
    }

    public function testConstruct()
    {
        $hander = new BugHandler();
        $this->assertIsA($hander, "Webservice\\Bug\\BugHandler");
    }
}
