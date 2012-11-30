<?php
namespace Helper;

class StringHelper
{
    public static function endsWith($haystack, $needle)
    {
        return substr($haystack, - strlen($needle)) === $needle;
    }

    public function startsWith($haystack, $needle)
    {
        return !strncmp($haystack, $needle, strlen($needle));
    }
}
