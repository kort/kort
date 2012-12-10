<?php
/**
 * kort - Webservice\Vote\VoteHandler class
 */
namespace Webservice\Vote;

use Webservice\DbProxyHandler;
use Webservice\RewardHandler;
use Model\Badge;
use Model\Reward;

/**
 * The VoteHandler class handles requests to the vote webservice.
 */
class VoteHandler extends DbProxyHandler
{
    /**
     * Returns the database table to be used with this Handler.
     *
     * @return the database table as a string
     */
    protected function getTable()
    {
        return 'kort.validation';
    }

    /**
     * Returns the database fields to be used with this Handler.
     *
     * @return an array of database fields
     */
    protected function getFields()
    {
        return array('fix_id', 'user_id', 'valid');
    }

    /**
     * Return sql statements parameter to set fixes to completed if they reached the threshold.
     *
     * @param array $data Vote data.
     *
     * @return array Parameter array.
     */
    protected function getCompletedParams(array $data)
    {
        $sql  = "update kort.fix set ";
        $sql .= "complete = ";
        $sql .= "(select required_validations - upratings + downratings <= 0 from kort.validations ";
        $sql .= " where id = " . $data['fix_id'] . ") ";
        $sql .= "where  fix_id = " . $data['fix_id'] . " ";
        $sql .= "returning complete";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }

    /**
     * Insert a new vote and handle the corresponding changes (koin_count, badges, completed etc.).
     *
     * @param array $data Vote data.
     *
     * @return string JSON-encoded reward for the user.
     */
    public function insertVote(array $data)
    {
        $transProxy = new \Webservice\TransactionDbProxy();

        $insertVoteParams = $this->insertParams($data);
        $highscoreBadgesParams = RewardHandler::getHighscoreBadgesParams($data);
        $fixCountBadgesParams = RewardHandler::getFixCountBadgesParams($data);
        $voteCountBadgesParams = RewardHandler::getVoteCountBadgesParams($data);
        $koinCountQuery = $this->getKoinCountQuery($data);
        $updateKoinCountParams = RewardHandler::updateKoinCointParams($data['user_id'], $koinCountQuery);
        $completedParams = $this->getCompletedParams($data);

        $transProxy->addToTransaction($insertVoteParams);
        $transProxy->addToTransaction($highscoreBadgesParams);
        $transProxy->addToTransaction($fixCountBadgesParams);
        $transProxy->addToTransaction($voteCountBadgesParams);
        $transProxy->addToTransaction($updateKoinCountParams);
        $transProxy->addToTransaction($completedParams);
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
        return "select vote_koin_count from kort.validations where id = " . $data['fix_id'];
    }
}
