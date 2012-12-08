<?php
namespace Webservice\User;

use Webservice\DbProxyHandler;

class UserBadgesHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.user_badges';
    }

    protected function getFields()
    {
        return array(
            'id',
            'name',
            'title',
            'description',
            'color',
            'sorting'
        );
    }

    public function getUserBadges($user_id)
    {
        $fields = $this->getFields();
        $wonFieldSql  = "exists(select 1 from kort.user_badge ub ";
        $wonFieldSql .= "where ub.user_id = " . $user_id . " and ub.badge_id = id) as won";
        $fields[] = urlencode($wonFieldSql);
        $this->getDbProxy()->setFields($fields);

        $userBadges = json_decode($this->getDbProxy()->select(), true);
        $userBadges = array_map(array($this, "convertBoolean"), $userBadges);
        return json_encode($userBadges);
    }

    public function convertBoolean($badge)
    {
        $badge['won'] = ($badge['won'] == 't') ? true : false;
        return $badge;
    }
}
