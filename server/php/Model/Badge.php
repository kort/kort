<?php

namespace Model;

class Badge
{
    protected $name;

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
