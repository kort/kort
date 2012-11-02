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

        if (isset($_SESSION['email'])) {
            $this->userData['email'] = $_SESSION['email'];
            $this->userData['picUrl'] = $this->getGravatarUrl();
        }

        return \json_encode($this->userData);
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
    private function getGravatarUrl ($s = 120, $d = 'mm', $r = 'r')
    {
        $url = 'http://www.gravatar.com/avatar/';
        $url .= \md5(\strtolower(\trim($this->userData['email'])));
        $url .= "?s=$s&d=$d&r=$r";
        return $url;
    }
}
