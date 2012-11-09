<?php
namespace Webservice\User;

use Webservice\Database\AbstractDbHandler;

class UserHandler extends AbstractDbHandler
{
    protected $userData = array();

    public function __construct()
    {
        $this->userData['name'] = "";
        $this->userData['email'] = "";
        $this->userData['username'] = "";
        $this->userData['picUrl'] = "";
        $this->userData['token'] = null;
        $this->userData['loggedIn'] = false;
    }

    public function getUser()
    {
        if (isset($_SESSION['token'])) {
            $tokenArray = \json_decode($_SESSION['token'], true);
            $this->userData['token'] = $tokenArray['access_token'];
            $this->userData['loggedIn'] = true;
        }

        if (isset($_SESSION['name'])) {
            $this->userData['name'] = $_SESSION['name'];
        }

        if (isset($_SESSION['username'])) {
            $this->userData['username'] = $_SESSION['username'];
        }

        if (isset($_SESSION['email'])) {
            $this->userData['email'] = $_SESSION['email'];
        }
        $this->userData['picUrl'] = $this->getGravatarUrl();

        $this->userData['fixCount'] = 0;
        $this->userData['verificationCount'] = 0;
        $this->userData['koinCount'] = 0;

        $this->userData['badges'] = $this->getUserBadges();

        return \json_encode($this->userData);
    }

    public function updateUser($id, $data)
    {
        $dataArr = json_decode($data, true);
        if (isset($_SESSION)) {
            $_SESSION['username'] = $dataArr['username'];
        }
    }

    public function insertUser($data)
    {
        // TODO implement insertUser
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
    private function getGravatarUrl ($s = 200, $d = 'mm', $r = 'r')
    {
        $url = 'http://www.gravatar.com/avatar/';
        $url .= \md5(\strtolower(\trim($this->userData['email'])));
        $url .= "?s=$s&d=$d&r=$r";
        return $url;
    }

    private function getUserBadges()
    {
        // TODO implement badges query
        return array(
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
    }
}
