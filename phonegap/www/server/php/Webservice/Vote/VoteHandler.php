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
        $sql .= "(select case when upratings >= required_votes or downratings >= required_votes ";
        $sql .= " then true else false end ";
        $sql .= " from kort.validations ";
        $sql .= " where id = " . $data['fix_id'] . "), ";
        $sql .= "valid = ";
        $sql .= "(select required_votes - upratings + downratings <= 0 ";
        $sql .= " from kort.validations ";
        $sql .= " where id = " . $data['fix_id'] . ") ";
        $sql .= "where  fix_id = " . $data['fix_id'] . " ";
        $sql .= "returning complete,valid";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }

    /**
     * Return sql statements parameter to give malus to fix_user if necessary.
     *
     * @param array $data Vote data.
     *
     * @return array Parameter array.
     */
    protected function getMalusParams(array $data)
    {
        $sql  = "update kort.user set ";
        $sql .= " koin_count = koin_count - coalesce((";
        $sql .= " select fix_koin_count ";
        $sql .= " from kort.fix f";
        $sql .= " ,kort.all_errors e ";
        $sql .= " ,kort.error_type t ";
        $sql .= " where f.fix_id = " . $data['fix_id'] . " ";
        $sql .= " and   not valid and complete ";
        $sql .= " and   f.error_id = e.error_id ";
        $sql .= " and   f.osm_id = e.osm_id ";
        $sql .= " and   f.schema = e.schema ";
        $sql .= " and   e.error_type_id = t.error_type_id ";
        $sql .= " ),0) ";
        $sql .= " where user_id = (select user_id from kort.fix where fix_id = " . $data['fix_id'] . ") ";
        $sql .= " returning user_id,koin_count";

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
        $malusParams = $this->getMalusParams($data);
        $transProxy->addToTransaction($malusParams);

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
        $query  = "select adfv.vote_koin_count + COALESCE(adfv.promo_extra_coins,0) ";
        $query .= "from kort.aggregateddata_from_all_validations adfv ";
        $query .= "where adfv.id = " . $data['fix_id'];
        return $query;
    }
}
