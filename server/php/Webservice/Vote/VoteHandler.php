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

        $sql  = "update kort.user set koin_count = koin_count + " . $voteKoinCount . " ";
        $sql .= "where user_id = ". $data['user_id'] . " ";
        $sql .= "returning koin_count koin_count_total, " . $voteKoinCount . " koin_count_new";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;

    }

    protected function getHighscoreBadgesParams($data)
    {
        $sql  = "insert into kort.user_badge (user_id, badge_id) ";
        $sql .= "select h.user_id, b.badge_id ";
        $sql .= "from   kort.highscore h ";
        $sql .= "inner join kort.badge b on b.name = 'highscore_place_' || h.ranking ";
        $sql .= "where  h.user_id = " . $data['user_id'] . " ";
        $sql .= "and not exists ";
        $sql .= " (select 1 from kort.user_badge ub ";
        $sql .= " where ub.user_id = h.user_id and ub.badge_id = b.badge_id)";
        $sql .= "returning badge_id";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }

    protected function getVoteCountBadgesParams($data)
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

    protected function getFixCountBadgesParams($data)
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

    protected function getCompletedParams($data)
    {
        $sql  = "update kort.fix set ";
        $sql .= "complete = ";
        $sql .= "(select required_validations - upratings + downratings >= 0 from kort.validations ";
        $sql .= " where id = " . $data['fix_id'] . ") ";
        $sql .= "where  fix_id = " . $data['fix_id'] . " ";
        $sql .= "returning complete";

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        return $params;
    }

    public function insertVote($data)
    {
        $transProxy = new \Webservice\TransactionDbProxy();

        $insertVoteParams = $this->insertParams($data);
        $highscoreBadgesParams = $this->getHighscoreBadgesParams($data);
        $fixCountBadgesParams = $this->getFixCountBadgesParams($data);
        $voteCountBadgesParams = $this->getVoteCountBadgesParams($data);
        $updateKoinCountParams = $this->updateKoinCointParams($data);
        $completedParams = $this->getCompletedParams($data);

        $transProxy->addToTransaction($insertVoteParams);
        $transProxy->addToTransaction($highscoreBadgesParams);
        $transProxy->addToTransaction($fixCountBadgesParams);
        $transProxy->addToTransaction($voteCountBadgesParams);
        $transProxy->addToTransaction($updateKoinCountParams);
        $transProxy->addToTransaction($completedParams);
        $result = json_decode($transProxy->sendTransaction(), true);
        //$result = $transProxy->sendTransaction();

        //return print_r($result);

        $badges = array();
        if (count($result[1]) > 0) {
            $highscoreBadgeId = $result[1][0]['badge_id'];
            $badges[] = Badge::findById($highscoreBadgeId);
        }
        if (count($result[2]) > 0) {
            $fixCountBadgeId = $result[2][0]['badge_id'];
            $badges[] = Badge::findById($fixCountBadgeId);
        }
        if (count($result[3]) > 0) {
            $voteCountBadgeId = $result[3][0]['badge_id'];
            $badges[] = Badge::findById($voteCountBadgeId);
        }

        $koinCountTotal = $result[4][0]['koin_count_total'];
        $koinCountNew = $result[4][0]['koin_count_new'];

        $reward = new Reward($koinCountTotal, $koinCountNew, $badges);
        return $reward->toJson();
    }
}
