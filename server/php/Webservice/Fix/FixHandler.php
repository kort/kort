<?php
/**
 * kort - Webservice\Fix\FixHandler class
 */
namespace Webservice\Fix;

use Webservice\DbProxyHandler;
use Webservice\IKoinCount;
use Webservice\RewardHandler;
use Webservice\TransactionDbProxy;
use Model\Badge;
use Model\Reward;

/**
 * The FixHandler handles request to the fix webservice.
 */
class FixHandler extends DbProxyHandler implements IKoinCount
{
    /**
     * Initialized the FixHandler object.
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
        return 'kort.fix';
    }

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array('user_id', 'error_id', 'schema', 'osm_id', 'message', 'falsepositive');
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
        $rewardHandler = new RewardHandler($this->getDbProxy(), $this);

        $insertVoteParams = $this->insertParams($data);
        $this->getDbProxy()->addToTransaction($insertVoteParams);
        $rewardHandler->applyRewards($data);

        $result = json_decode($this->getDbProxy()->sendTransaction(), true);
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


        $sql  = "select total_koin_count from kort.aggregateddate_from_missions e ";
        $sql .= "where e.osm_id = " . $data['osm_id'] . " ";
        $sql .= "and e.schema = '" . $data['schema'] . "' ";
        $sql .= "and e.mission_error_id = " . $data['error_id'];

        /*
        $sql  = "select fix_koin_count from kort.all_errors e, kort.error_types t ";
        $sql .= "where e.error_type_id = t.error_type_id ";
        $sql .= "and e.osm_id = " . $data['osm_id'] . " ";
        $sql .= "and e.schema = '" . $data['schema'] . "' ";
        $sql .= "and e.error_id = " . $data['error_id'];
        */

        return $sql;
    }
}
