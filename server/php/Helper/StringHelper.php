<?php
namespace Helper;

class StringHelper
{
    public static function endsWith($haystack, $needle)
    {
        return substr($haystack, - strlen($needle)) === $needle;
    }
}
