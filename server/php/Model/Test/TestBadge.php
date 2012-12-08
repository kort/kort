<?php
namespace Model\Test;

use TestHelper\AbstractKortUnitTestCase;
use Model\Badge;

class TestBadge extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestBadge");
    }

    public function testGetName() {
        $badge = new Badge("myTestBadgeName");
        $this->assertEqual("myTestBadgeName", $badge->getName(), "Input name should match the output");
    }

    public function testFindById()
    {
        $badge = Badge::findById(1);
        $this->assertEqual("highscore_place_1", $badge->getName(), "ID:1 should be the highscore_place_1 badge");
    }
}
