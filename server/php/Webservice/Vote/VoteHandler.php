<?php
namespace Webservice\Vote;

use Webservice\DbProxyHandler;
use Model\Badge;
use Model\Reward;

class VoteHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.validation';
    }

    protected function getFields()
    {
        return array('fix_id', 'user_id', 'valid');
    }

    public function insertVote($data)
    {
        $transProxy = new \Webservice\TransactionDbProxy();

        $this->getDbProxy()->setReturnFields($this->getFields());
        $insertVoteParams = $this->getDbProxy()->getInsertParams($data, true);
        $transProxy->addToTransaction($insertVoteParams);


        $insertedVote = $transProxy->sendTransaction();

        //return $reward;

        //1. query insert vote
        //2. berechne badges + koins
        //3. badges hinzufügen / koins dazuzählen

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
