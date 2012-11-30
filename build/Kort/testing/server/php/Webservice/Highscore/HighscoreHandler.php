<?php
namespace Webservice\Highscore;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;

class HighscoreHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.highscore';
    }

    protected function getFields()
    {
        return array(
            'user_id',
            'username',
            'koin_count',
            'fix_count',
            'vote_count',
            'ranking'
        );
    }

    public function getHighscore()
    {
        $scoreList = json_decode($this->getDbProxy()->select(), true);
        $addOwnUserId = function($score) {
            $score['you'] = ($score['user_id'] == 4);
            return $score;
        };
        $scoreList = array_map($addOwnUserId, $scoreList);
        return json_encode($scoreList);
    }
}
