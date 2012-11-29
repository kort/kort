<?php
namespace Webservice\Vote;

use Webservice\DbProxyHandler;
use Model\Badge;
use Model\Reward;

class VoteHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.vote';
    }

    protected function getFields()
    {
        return array('validation_id', 'message');
    }

    public function insertFix($data)
    {
        $insertedVote = $this->getDbProxy()->insert($data);

        if (!$insertedVote) {
            return false;
        }

        $koinCount = 100;
        $firstBadge = new Badge("highscore_place_1");
        $voteBadge = new Badge("vote_count_10");
        $reward = new Reward($koinCount, array($firstBadge, $voteBadge));
        return $reward->toJson();
    }
}
