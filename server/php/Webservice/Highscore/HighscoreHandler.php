<?php
/**
 * kort -Webservice\Highscore\HighscoreHandler class
 */
namespace Webservice\Highscore;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

/**
 * The HighscoreHandler handles request to the highscore webservice.
 */
class HighscoreHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     *
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.highscore';
    }

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array(
            'user_id',
            'username',
            'oauth_user_id',
            'koin_count',
            'fix_count',
            'vote_count',
            'ranking'
        );
    }

    /**
     * Return the current highscore with users, points etc.
     *
     * @param integer $limit The amount of entries this method should return.
     *
     * @return string|bool the JSON-encoded highscore if successful, false otherwise
     */
    public function getHighscore($limit)
    {
        $this->getDbProxy()->setLimit($limit);
        $scoreData = $this->getDbProxy()->select();
        if (!$scoreData) {
            return false;
        }
        $scoreList = json_decode($scoreData, true);
        $scoreList = array_map("self::isYourScore", $scoreList);
        $scoreList = array_map("self::setGravatarUrl", $scoreList);
        
        return json_encode($scoreList);
    }

    /**
     * Adds a field to a score to indicate wheter a user is the currently logged in user or not.
     *
     * @param array $score The score data.
     *
     * @return array the $score array with an additional field "you"
     */
    protected static function isYourScore(array $score)
    {
        if (isset($_SESSION['user_id'])) {
            $score['you'] = ($score['user_id'] == $_SESSION['user_id']);
        }
        return $score;
    }
    
    /**
     * Replaces field "oauth_user_id" with "pic_url"
     *
     * @param array $score The score data.
     *
     * @return array the $score array with the replaced field
     */
    protected static function setGravatarUrl(array $score)
    {
        $score['pic_url'] = self::getGravatarUrl($score['oauth_user_id']);
        unset($score['oauth_user_id']);
        return $score;
    }
    
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
    protected static function getGravatarUrl ($email, $size = 200, $imageSet = 'mm', $rating = 'r')
    {
        $url = 'http://www.gravatar.com/avatar/';
        $url .= \md5(\strtolower(\trim($email)));
        $url .= "?s=$size&d=$imageSet&r=$rating";
        return $url;
    }
}
