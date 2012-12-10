<?php
/**
 * kort - Webservice\RewardHandler class
 */
namespace Webservice;

/**
 * The RewardHandler class takes care of webservices that return rewards to the user.
 */
class RewardHandler
{
    /**
     * Return sql statements parameter to update the koin_count of a user.
     *
     * @param integer $user_id        The user id.
     * @param string  $koinCountQuery The query to find the koiCount.
     *
     * @return array Parameter array.
     */
    public static function updateKoinCointParams($user_id, $koinCountQuery)
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
        $sql .= "returning badge_id";

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
        $sql .= "returning badge_id";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }
}
