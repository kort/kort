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
        return array('error_id', 'message');
    }

    public function insertFix($data)
    {
        $success = $this->getDbProxy()->insert($data);

        if (!$success) {
            return false;
        }

        $koinCount = 100;
        $firstBadge = new Badge("highscore_place_1");
        $voteBadge = new Badge("vote_count_10");
        $reward = new Reward($koinCount, array($firstBadge, $voteBadge));
        return $reward->toJson();
    }
}
