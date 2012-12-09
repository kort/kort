<?php
/**
 * kort -Webservice\Highscore\HighscoreHandler class
 */
namespace Webservice\Highscore;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

/**
 * The HighscoreHandler handles request to the highscore webservice
 */
class HighscoreHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.highscore';
    }

    /**
     * Returns the table fields used by this handler.
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array(
            'user_id',
            'username',
            'koin_count',
            'fix_count',
            'vote_count',
            'ranking'
        );
    }

    /**
     * Return the current highscore with users, points etc.
     * @return string|bool the JSON-encoded highscore if successful, false otherwise
     */
    public function getHighscore()
    {
        $scoreData = $this->getDbProxy()->select();
        if (!$scoreData) {
            return false;
        }
        $scoreList = json_decode($scoreData, true);
        $scoreList = array_map("self::isYourScore", $scoreList);
        return json_encode($scoreList);
    }

    /**
     * Adds a field to a score to indicate wheter a user is the currently logged in user or not.
     * @param array $score the score data
     * @return array the $score array with an additional field "you"
     */
    protected static function isYourScore($score)
    {
        if (isset($_SESSION['user_id'])) {
            $score['you'] = ($score['user_id'] == $_SESSION['user_id']);
        }
        return $score;
    }
}
