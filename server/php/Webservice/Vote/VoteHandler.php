<?php
/**
 * kort - Webservice\Vote\VoteHandler class
 */
namespace Webservice\Vote;

use Webservice\DbProxyHandler;
use Webservice\IKoinCount;
use Webservice\RewardHandler;
use Webservice\TransactionDbProxy;
use Model\Badge;
use Model\Reward;

/**
 * The VoteHandler class handles requests to the vote webservice.
 */
class VoteHandler extends DbProxyHandler implements IKoinCount
{
    /**
     * Returns the database table to be used with this Handler.
     *
     * @return the database table as a string
     */
    protected function getTable()
    {
        return 'kort.vote';
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
        $sql .= "(select required_votes - upratings + downratings <= 0 from kort.validations ";
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
        $transProxy = new TransactionDbProxy();
        $rewardHandler = new RewardHandler($transProxy, $this);

        $insertVoteParams = $this->insertParams($data);
        $transProxy->addToTransaction($insertVoteParams);
        $rewardHandler->applyRewards($data);
        $completedParams = $this->getCompletedParams($data);
        $transProxy->addToTransaction($completedParams);

        $result = json_decode($transProxy->sendTransaction(), true);
        $reward = $rewardHandler->extractReward($result);
        return $reward->toJson();
    }

    /**
     * Returns the query to find the koinCount for votes.
     *
     * @param array $data The inserted data.
     *
     * @return string query to find the koinCount for votes
     */
    public function getKoinCountQuery(array $data)
    {
        return "select vote_koin_count from kort.validations where id = " . $data['fix_id'];
    }
}
