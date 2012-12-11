<?php
/**
 * kort - Webservice\Fix\FixHandler class
 */
namespace Webservice\Fix;

use Webservice\DbProxyHandler;
use Webservice\RewardHandler;
use Model\Badge;
use Model\Reward;

/**
 * The FixHandler handles request to the fix webservice.
 */
class FixHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     *
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.fix';
    }

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array('user_id', 'error_id', 'schema', 'osm_id', 'message');
    }

    /**
     * Saves a fix in the database and gives the user a reward for this action.
     *
     * @param array $data The fix data.
     *
     * @return string|bool return the JSON-encoded reward for the user of successful, false otherwise
     */
    public function insertFix(array $data)
    {
        $transProxy = new \Webservice\TransactionDbProxy();

        $insertFixParams = $this->insertParams($data);
        $highscoreBadgesParams = RewardHandler::getHighscoreBadgesParams($data);
        $fixCountBadgesParams = RewardHandler::getFixCountBadgesParams($data);
        $voteCountBadgesParams = RewardHandler::getVoteCountBadgesParams($data);

        $koinCountQuery = $this->getKoinCountQuery($data);
        $updateKoinCountParams = RewardHandler::updateKoinCointParams($data['user_id'], $koinCountQuery);

        $transProxy->addToTransaction($insertFixParams);
        $transProxy->addToTransaction($highscoreBadgesParams);
        $transProxy->addToTransaction($fixCountBadgesParams);
        $transProxy->addToTransaction($voteCountBadgesParams);
        $transProxy->addToTransaction($updateKoinCountParams);
        $result = json_decode($transProxy->sendTransaction(), true);

        $badges = array();
        if (count($result[1]) > 0) {
            $highscoreBadgeId = $result[1][0]['badge_id'];
            $highscoreCreateDate = $result[1][0]['create_date'];
            $badge = Badge::findById($highscoreBadgeId);
            $badge->setCreateDate($highscoreCreateDate);
            $badges[] = $badge;
        }
        if (count($result[2]) > 0) {
            $fixCountBadgeId = $result[2][0]['badge_id'];
            $fixCountCreateDate = $result[2][0]['create_date'];
            $badge = Badge::findById($fixCountBadgeId);
            $badge->setCreateDate($fixCountCreateDate);
            $badges[] = $badge;
        }
        if (count($result[3]) > 0) {
            $voteCountBadgeId = $result[3][0]['badge_id'];
            $voteCountCreateDate = $result[3][0]['create_date'];
            $badge = Badge::findById($voteCountBadgeId);
            $badge->setCreateDate($voteCountCreateDate);
            $badges[] = $badge;
        }

        $koinCountTotal = $result[4][0]['koin_count_total'];
        $koinCountNew = $result[4][0]['koin_count_new'];

        $reward = new Reward($koinCountTotal, $koinCountNew, $badges);
        return $reward->toJson();
    }

    /**
     * Returns the query to find the koinCount for votes.
     *
     * @param array $data The inserted data.
     *
     * @return string query to find the koinCount for votes
     */
    protected function getKoinCountQuery(array $data)
    {
        $sql  = "select fix_koin_count from kort.error_koin_count ";
        $sql .= "where osm_id = " . $data['osm_id'] . " ";
        $sql .= "and schema = '" . $data['schema'] . "' ";
        $sql .= "and id = " . $data['error_id'];
        return $sql;
    }
}
