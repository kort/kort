<?php
namespace Webservice\User;

use Webservice\DbProxyHandler;

class UserGetHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.user_model';
    }

    protected function getFields()
    {
        return array(
            'id',
            'name',
            'username',
            'email',
            'token',
            'fix_count',
            'validation_count',
            'koin_count',
            'secret'
        );
    }

    public function getUser($secret)
    {
        $userData = array();
        if (!empty($secret)) {
            $this->getDbProxy()->setWhere("secret = '". $secret . "'");
            $userData = json_decode($this->getDbProxy()->select(), true);
            $userData = $userData[0];

            if($userData) {
                session_start();
                $_SESSION['secret'] = $secret;
                $userData['pic_url'] = $this->getGravatarUrl($userData['email']);
                $userData['logged_in'] = true;
            }
        }
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
    * @param  Size in pixels, defaults to 80px [ 1 - 2048 ]
    * @param  Default imageset to use [ 404 | mm | identicon | monsterid | wavatar ]
    * @param  Maximum rating (inclusive) [ g | pg | r | x ]
    * @return String containing the URL
    * @source http://gravatar.com/site/implement/images/php/
    */
    protected function getGravatarUrl ($email, $sizeInPixel = 200, $imageSet = 'mm', $rating = 'r')
    {
        $url = 'http://www.gravatar.com/avatar/';
        $url .= \md5(\strtolower(\trim($email)));
        $url .= "?s=$sizeInPixel&d=$imageSet&r=$rating";
        return $url;
    }
}
