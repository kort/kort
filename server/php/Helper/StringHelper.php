<?php
/**
 * kort - Helper\StringHelper class
 */

namespace Helper;

/**
 * The StringHelper class implements some common string functions that
 * are missing in standard PHP.
 */
class StringHelper
{
    /**
     * Checks if $haystack ends with the string $needle
     * @param string $haystack the input string
     * @param string $needle the string to look for
     * @return bool true of $haystack ends with $needle
     */
    public static function endsWith($haystack, $needle)
    {
        return substr($haystack, - strlen($needle)) === $needle;
    }

    /**
     * Checks if $haystack start with $needle
     * @param string $haystack the input string
     * @param string $needle the string to look for
     * @return bool true if $haystack starts with $needle, false otherwise
     */
    public function startsWith($haystack, $needle)
    {
        return !strncmp($haystack, $needle, strlen($needle));
    }
}
