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
        return $this->getDbProxy()->select();
    }
}
