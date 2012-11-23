<?php
namespace Webservice\User;

use Webservice\DbProxyHandler;

class UserGetHandler extends DbProxyHandler
{
    protected $table = 'kort.user_model';
    protected $fields = array(
        'id',
        'name',
        'username',
        'email',
        'token',
        'fixCount',
        'validationCount',
        'koinCount'
    );

    public function getUser($id)
    {
        $this->getDbProxy()->setWhere("id = ". $id);
        $userData = json_decode($this->getDbProxy()->getFromDb(), true);
        $userData = $userData[0];

        $userData['picUrl'] = $this->getGravatarUrl($userData['email']);
        $userData['loggedIn'] = isset($_SESSION['token']);

        return json_encode($userData);
    }

    public function getUserBadges($id)
    {
        // TODO implement badges query
        $badges = array(
            array(
                'id' => 1,
                'name' => 'highscore_place_1',
                'won' => false
            ),
            array(
                'id' => 2,
                'name' => 'highscore_place_2',
                'won' => false
            ),
            array(
                'id' => 3,
                'name' => 'highscore_place_3',
                'won' => true
            ),
            array(
                'id' => 4,
                'name' => 'fix_count_100',
                'won' => false
            ),
            array(
                'id' => 5,
                'name' => 'fix_count_50',
                'won' => true
            ),
            array(
                'id' => 6,
                'name' => 'fix_count_10',
                'won' => true
            )
        );
        return \json_encode($badges);
    }

    /**
    * Get either a Gravatar URL or complete image tag for a specified email address.
    *
    * @param string $s Size in pixels, defaults to 80px [ 1 - 2048 ]
    * @param string $d Default imageset to use [ 404 | mm | identicon | monsterid | wavatar ]
    * @param string $r Maximum rating (inclusive) [ g | pg | r | x ]
    * @return String containing the URL
    * @source http://gravatar.com/site/implement/images/php/
    */
    protected function getGravatarUrl ($email, $s = 200, $d = 'mm', $r = 'r')
    {
        $url = 'http://www.gravatar.com/avatar/';
        $url .= \md5(\strtolower(\trim($email)));
        $url .= "?s=$s&d=$d&r=$r";
        return $url;
    }
}
