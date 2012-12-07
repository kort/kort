<?php

namespace Model;

class Badge
{
    protected $name;

    public static function findById($id)
    {
        $names = self::getNames();
        if (array_key_exists($id, $names)) {
            return new Badge($names[$id]);
        }
        return null;
    }

    protected static function getNames() {
        return array(
            1 => 'highscore_place_1',
            2 => 'highscore_place_2',
            3 => 'highscore_place_3',
            4 => 'fix_count_100',
            5 => 'fix_count_50',
            6 => 'fix_count_10',
            7 => 'vote_count_1000',
            8 => 'vote_count_100',
            9 => 'vote_count_10'
        );
    }

    public function __construct($name)
    {
        $this->name = $name;
    }

    public function getName()
    {
        return $this->name;
    }


    public static function getValueFn()
    {
        return function ($badge) {
            return array("name" => $badge->getName());
        };
    }
}
