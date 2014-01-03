<?php
/**
 * kort - Helper\GravatarHelper class
 */
namespace Helper;

/**
 * The GravatarHelper class is a helper to get Gravatar pictures.
 */
class GravatarHelper
{
    /**
     * Get either a Gravatar URL or complete image tag for a specified email address.
     *
     * @param string  $email    The email address of the user.
     * @param integer $size     Size in pixels, defaults to 200px [ 1 - 2048 ].
     * @param string  $imageSet Default imageset to use [ 404 | mm | identicon | monsterid | wavatar ].
     * @param string  $rating   Maximum rating (inclusive) [ g | pg | r | x ].
     *
     * @return string containing the URL
     * @link http://gravatar.com/site/implement/images/php/
     */
    public static function getGravatarUrl($email, $size = 200, $imageSet = 'mm', $rating = 'r')
    {
        $url = 'http://www.gravatar.com/avatar/';
        $url .= \md5(\strtolower(\trim($email)));
        $url .= "?s=$size&d=$imageSet&r=$rating";
        return $url;
    }
}
