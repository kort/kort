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
            'won',
            'sorting'
        );
    }

    public function getUserBadges($user_id)
    {
        // TODO implement badges query
        $badges = array(
            array(
                'id' => 1,
                'name' => 'highscore_place_1',
                'title' => '1. Platz',
                'description' => 'Erster Platz erreicht.',
                'won' => false
            ),
            array(
                'id' => 2,
                'name' => 'highscore_place_2',
                'title' => '2. Platz',
                'description' => 'Zweiter Platz erreicht.',
                'won' => false
            ),
            array(
                'id' => 3,
                'name' => 'highscore_place_3',
                'title' => '3. Platz',
                'description' => 'Dritter Platz erreicht.',
                'won' => true
            ),
            array(
                'id' => 4,
                'name' => 'fix_count_100',
                'title' => '100 Aufträge',
                'description' => '100 Aufträge erledigt',
                'won' => false
            ),
            array(
                'id' => 5,
                'name' => 'fix_count_50',
                'title' => '50 Aufträge',
                'description' => '50 Aufträge erledigt',
                'won' => true
            ),
            array(
                'id' => 6,
                'name' => 'fix_count_10',
                'title' => '10 Aufträge',
                'description' => '10 Aufträge erledigt',
                'won' => true
            )
        );
        return \json_encode($badges);
    }
}
