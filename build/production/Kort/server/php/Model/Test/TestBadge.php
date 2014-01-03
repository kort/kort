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

    public function testGetName()
    {
        $badge = new Badge("myTestBadgeName");
        $this->assertEqual("myTestBadgeName", $badge->getName(), "Input name should match the output");
    }

    public function testFindById()
    {
        $badge = Badge::findById(1);
        $this->assertEqual("highscore_place_1", $badge->getName(), "ID:1 should be the highscore_place_1 badge");
    }

    public function testGetValues()
    {
        $badge1 = new Badge("badge1");
        $badge2 = new Badge("badge2");
        $badges = array($badge1, $badge2);

        $values = Badge::getValues($badges);
        $this->assertIsA($values, "Array", "getValues() should return an array");
        $this->assertEqual(2, count($values), "Array should contain 2 elements");

        $this->assertIsA($values[0], "Array");
        $this->assertIsA($values[1], "Array");

        $this->assertEqual("badge1", $values[0]['name'], "Name should equal the input");
        $this->assertEqual("badge2", $values[1]['name'], "Name should equal the input");
    }
}
