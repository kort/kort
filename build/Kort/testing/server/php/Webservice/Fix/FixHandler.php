<?php
namespace Webservice\Fix;

use Webservice\DbProxyHandler;
use Model\Badge;
use Model\Reward;

class FixHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.fix';
    }

    protected function getFields()
    {
        return array('user_id', 'error_id', 'schema', 'osm_id', 'message');
    }

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
