<?php
/**
 * kort -Webservice\Highscore\HighscoreHandler class
 */
namespace Webservice\Highscore;

use Webservice\DbProxyHandler;
use Webservice\TransactionDbProxy;
use Helper\PostGisSqlHelper;
use Helper\GravatarHelper;

/**
 * The HighscoreHandler handles request to the highscore webservice.
 */
class HighscoreHandler extends DbProxyHandler
{
    /**
     * Initialized the HighscoreHandler object.
     *
     * @param TransactionDbProxy $dbProxy The database proxy object.
     */
    public function __construct(TransactionDbProxy $dbProxy = null)
    {
        parent::__construct();
        if (empty($dbProxy)) {
            $this->setDbProxy(new TransactionDbProxy());
        } else {
            $this->setDbProxy($dbProxy);
        }
    }

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
        $sql  = "select * from (select " . implode($this->getFields(), ',');
        $sql .= " from " . $this->getTable();
        $sql .= " limit " . $limit;
        $sql .= ") hs union ";
        $sql .= "select * from ";
        $sql .= "(select " . implode($this->getFields(), ',');
        $sql .= " from " . $this->getTable();
        $sql .= " ) my where my.user_id = " . $_SESSION['user_id'];
        $sql .= " order by ranking";


        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        $position = $this->getDbProxy()->addToTransaction($params);
        $result = json_decode($this->getDbProxy()->sendTransaction(), true);
        $scoreList = $result[$position - 1];
        if (!$scoreList) {
            return false;
        }
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
     * Replaces field "oauth_user_id" with "pic_url".
     *
     * @param array $score The score data.
     *
     * @return array the $score array with the replaced field
     */
    protected static function setGravatarUrl(array $score)
    {
        $score['pic_url'] = GravatarHelper::getGravatarUrl($score['oauth_user_id']);
        unset($score['oauth_user_id']);
        return $score;
    }
}
