<?php
/**
 * kort - Webservice\Fix\FixHandler class
 */
namespace Webservice\Fix;

use Webservice\DbProxyHandler;
use Model\Badge;
use Model\Reward;

/**
 * The FixHandler handles request to the fix webservice
 */
class FixHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.fix';
    }

    /**
     * Returns the table fields used by this handler.
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array('user_id', 'error_id', 'schema', 'osm_id', 'message');
    }

    /**
     * Saves a fix in the database and gives the user a reward for this action.
     * @param array $data the fix data
     * @return string|bool return the JSON-encoded reward for the user of successful, false otherwise
     */
    public function insertFix($data)
    {
        $insertedFix = $this->getDbProxy()->insert($data);

        if (!$insertedFix) {
            return false;
        }

        $koinCount = 100;
        $firstBadge = new Badge("highscore_place_1");
        $voteBadge = new Badge("vote_count_10");
        $reward = new Reward($koinCount, array($firstBadge, $voteBadge));
        return $reward->toJson();
    }
}
