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

    protected function updateKoinCointParams($data)
    {
        $voteKoinCount = "(select vote_koin_count from kort.validations where id = " . $data['fix_id'] . ")";

        $params = array($data);
        $params['table'] = "kort.user";
        $params['fields'] = array("koin_count");
        $params['data'] = array(
            "koin_count" => "koin_count + " . $voteKoinCount
        );
        $params['returnFields'] = array(
            "koin_count koin_count_total",
            $voteKoinCount. " koin_count_new"
        );
        $params['where'] = "user_id = " . $data['user_id'];

        $params['return'] = true;
        $params['type'] = "UPDATE";

        return $params;

    }

    protected function insertVoteParams($data) {
        $params = array();
        $params['table'] = $this->getTable();
        $params['fields'] = $this->getFields();
        $params['returnFields'] = $this->getFields();
        $params['data'] = $data;

        $params['return'] = false;
        $params['type'] = "INSERT";

        return $params;
    }

    public function insertVote($data)
    {
        $transProxy = new \Webservice\TransactionDbProxy();

        $insertVoteParams = $this->insertVoteParams($data);
        $updateKoinCountParams = $this->updateKoinCointParams($data);

        $transProxy->addToTransaction($insertVoteParams);
        $transProxy->addToTransaction($updateKoinCountParams);



        //$bugHandler = new \Webservice\Bug\BugHandler();
        //$selectError = $bugHandler->getByFixId($data['fix_id']);

        $vote = $transProxy->sendTransaction();

        //return $reward;

        //1. query insert vote
        //2. berechne badges + koins
        //3. badges hinzufügen / koins dazuzählen
        //4.

        if (!$vote) {
            return false;
        }

        return $vote;

        $koinCountTotal = $vote['koin_count_total'];
        $koinCountNew = $vote['koin_count_new'];
        $firstBadge = new Badge("highscore_place_1");
        $voteBadge = new Badge("vote_count_10");
        $reward = new Reward($koinCountTotal, $koinCountNew, array($firstBadge, $voteBadge));
        return $reward->toJson();
    }
}
