<?php
/**
 * kort - Webservice\RewardHandler class
 */
namespace Webservice;

use Model\Reward;
use Model\Badge;

/**
 * The RewardHandler class takes care of webservices that return rewards to the user.
 */
class RewardHandler
{
    /**
     * The TransactionDbProxy to which the rewards statements are added.
     *
     * @var TransactionDbProxy
     */
    protected $transProxy;

    /**
     * The handler which defines which koinCounts should be applied.
     *
     * @var IKoinCount
     */
    protected $koinCountHandler;

    /**
     * This array keeps track which transaction statement is at which position.
     *
     * To extract the results from the database response, it's important to have
     * a mapping from the statements to the return value.
     *
     * @var array
     */
    protected $positions = array();

    /**
     * Return sql statements parameter to update the koin_count of a user.
     *
     * @param integer $user_id        The user id.
     * @param string  $koinCountQuery The query to find the koiCount.
     *
     * @return array Parameter array.
     */
    public static function updateKoinCountParams($user_id, $koinCountQuery)
    {
        $sql  = "update kort.user set koin_count = koin_count + (" . $koinCountQuery . ") ";
        $sql .= "where user_id = ". $user_id . " ";
        $sql .= "returning koin_count koin_count_total, (" . $koinCountQuery . ") koin_count_new";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }

    /**
     * Return sql statements parameter to check for the highscore* badges.
     *
     * @param array $data Vote data.
     *
     * @return array Parameter array.
     */
    public static function getHighscoreBadgesParams(array $data)
    {
        $sql  = "insert into kort.user_badge (user_id, badge_id) ";
        $sql .= "select h.user_id, b.badge_id ";
        $sql .= "from   kort.highscore h ";
        $sql .= "inner join kort.badge b on b.name = 'highscore_place_' || h.ranking ";
        $sql .= "where  h.user_id = " . $data['user_id'] . " ";
        $sql .= "and not exists ";
        $sql .= " (select 1 from kort.user_badge ub ";
        $sql .= " where ub.user_id = h.user_id and ub.badge_id = b.badge_id)";
        $sql .= "returning badge_id, create_date";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }

    /**
     * Return sql statements parameter to check for the vote_count* badges.
     *
     * @param array $data Vote data.
     *
     * @return array Parameter array.
     */
    public static function getVoteCountBadgesParams(array $data)
    {
        $sql  = "insert into kort.user_badge (user_id, badge_id) ";
        $sql .= "select u.id, b.badge_id ";
        $sql .= "from   kort.badge b, kort.user_model u ";
        $sql .= "where  u.id = " . $data['user_id'] . " ";
        $sql .= "and b.compare_value <= u.vote_count ";
        $sql .= "and b.name like 'vote_count_%' ";
        $sql .= "and not exists ";
        $sql .= " (select 1 from kort.user_badge ub ";
        $sql .= " where ub.user_id = u.id and ub.badge_id = b.badge_id)";
        $sql .= "returning badge_id, create_date";

        $params = array();
        $params['sql'] = $sql;
        $params['return'] = true;
        $params['type'] = "SQL";

        return $params;
    }

    /**
     * Return sql statements parameter to check for the fix_count* badges.
     *
     * @param array $data Vote data.
     *
     * @return array Parameter array.
     */
    public static function getFixCountBadgesParams(array $data)
    {
        $sql  = "insert into kort.user_badge (user_id, badge_id) ";
        $sql .= "select u.id, b.badge_id ";
        $sql .= "from   kort.badge b, kort.user_model u ";
        $sql .= "where  u.id = " . $data['user_id'] . " ";
        $sql .= "and b.compare_value <= u.fix_count ";
        $sql .= "and b.name like 'fix_count_%' ";
        $sql .= "and not exists ";
        $sql .= " (select 1 from kort.user_badge ub ";
        $sql .= " where ub.user_id = u.id and ub.badge_id = b.badge_id)";
        $sql .= "returning badge_id, create_date";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }

    /**
     * Create a new RewardHandler.
     *
     * @param TransactionDbProxy $transProxy       The database proxy to handle the data.
     * @param IKoinCount         $koinCountHandler A koin-count manipulating handler.
     */
    public function __construct(TransactionDbProxy $transProxy, IKoinCount $koinCountHandler)
    {
        $this->transProxy = $transProxy;
        $this->koinCountHandler = $koinCountHandler;
    }

    /**
     * Applies rewards for the users actions.
     *
     * @param array $data The data from the users action.
     *
     * @return void
     */
    public function applyRewards(array $data)
    {
        $this->updateKoinCount($data);
        $this->updateBadges($data);
    }

    /**
     * Checks if the user won any new badges.
     *
     * @param array $data The data from the user.
     *
     * @return void
     */
    protected function updateBadges(array $data)
    {
        $highscoreBadgesParams = self::getHighscoreBadgesParams($data);
        $this->position["badge"][] = $this->transProxy->addToTransaction($highscoreBadgesParams);

        $fixCountBadgesParams = self::getFixCountBadgesParams($data);
        $this->position["badge"][] = $this->transProxy->addToTransaction($fixCountBadgesParams);

        $voteCountBadgesParams = self::getVoteCountBadgesParams($data);
        $this->position["badge"][] = $this->transProxy->addToTransaction($voteCountBadgesParams);
    }

    /**
     * Credit the user with koins for his action.
     *
     * @param array $data The data from the user.
     *
     * @return void
     */
    protected function updateKoinCount(array $data)
    {
        $koinCountQuery = $this->koinCountHandler->getKoinCountQuery($data);
        $updateKoinCountParams = RewardHandler::updateKoinCountParams($data['user_id'], $koinCountQuery);

        $this->position["koinCount"] = $this->transProxy->addToTransaction($updateKoinCountParams);
    }

    /**
     * Extracts the rewards (koins, badges) from the database response.
     *
     * @param array $result The response from the database.
     *
     * @return \Model\Reward
     */
    public function extractReward(array $result)
    {
        $badges = $this->extractAllBadges($result);
        $koinCountNew = $this->extractKoinCountNew($result);
        $koinCountTotal = $this->extractKoinCountTotal($result);

        return new Reward($koinCountTotal, $koinCountNew, $badges);
    }

    /**
     * Extracts all the won badges from the response of the database.
     *
     * @param array $result The response from the database.
     *
     * @return array All won badges
     */
    protected function extractAllBadges(array $result)
    {
        $allBadges = array();
        foreach ($this->position['badge'] as $badgePosition) {
            $badgesData = $result[$badgePosition - 1];
            if (!empty($badgesData)) {
                $allBadges = array_merge($allBadges, $this->extractBadges($badgesData));
            }
        }
        return $allBadges;
    }

    /**
     * Extracts the won badges of one kind from the response of the database.
     *
     * @param array $badgesData The database response for on kind of badges.
     *
     * @return array All won badges of one kind.
     */
    protected function extractBadges(array $badgesData)
    {
        $badges = array();
        foreach ($badgesData as $badgeData) {
            $badgeId = $badgeData['badge_id'];
            $createDate = $badgeData['create_date'];
            $badge = Badge::findById($badgeId);
            $badge->setCreateDate($createDate);
            $badges[] = $badge;
        }
        return $badges;
    }

    /**
     * Extracts the amount of new koins from the database response.
     *
     * @param array $result The response from the database.
     *
     * @return integer The amount of koins a user has won
     */
    protected function extractKoinCountNew(array $result)
    {
        $koinCountData = $result[$this->position['koinCount'] - 1];
        return $koinCountData[0]['koin_count_new'];
    }

    /**
     * Extracts the new total amount of koins of a user from the database response.
     *
     * @param array $result The response from the database.
     *
     * @return integer The new total amount of koins of a user.
     */
    protected function extractKoinCountTotal(array $result)
    {
        $koinCountData = $result[$this->position['koinCount'] - 1];
        return $koinCountData[0]['koin_count_total'];
    }
}
