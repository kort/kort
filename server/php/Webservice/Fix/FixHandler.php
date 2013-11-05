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


        $sql  = "select adfm.fix_koin_count + COALESCE(adfm.promo_extra_coins,0) ";
        $sql .= "from kort.aggregateddata_from_all_missions adfm ";
        $sql .= "where adfm.osm_id = " . $data['osm_id'] . " ";
        $sql .= "and adfm.schema = '" . $data['schema'] . "' ";
        $sql .= "and adfm.mission_error_id = " . $data['error_id'];

        return $sql;
    }
}
