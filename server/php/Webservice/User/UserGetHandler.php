<?php
namespace Webservice\User;

use Webservice\DbProxyHandler;

class UserGetHandler extends DbProxyHandler
{
    /**
    * Returns the database table to be used with this Handler.
    * @return the database table as a string
    */
    protected function getTable()
    {
        return 'kort.user_model';
    }

    /**
    * Returns the database fields to be used with this Handler.
    * @return an array of database fields
    */
    protected function getFields()
    {
        return array(
            'id',
            'name',
            'username',
            'oauth_user_id',
            'oauth_provider',
            'token',
            'fix_count',
            'vote_count',
            'koin_count',
            'secret'
        );
    }

    /**
    * Returns a user identified by his specific secret
    *
    * @param $secret the user's secret
    * @return the JSON encoded user information
    */
    public function getUserBySecret($secret)
    {
        if (!empty($secret)) {
            $this->getDbProxy()->setWhere("secret = '". $secret . "'");
            $userData = json_decode($this->getDbProxy()->select(), true);
            $userData = $userData[0];

            if (!empty($userData)) {
                if (!isset($_SESSION)) {
                    session_start();
                }
                $_SESSION['secret'] = $secret;
                $_SESSION['user_id'] = $userData['id'];
                $userData['pic_url'] = $this->getGravatarUrl($userData['oauth_user_id']);
                $userData['logged_in'] = true;
                return json_encode($userData);
            }
        }
        return $this->getDefaultUserJson();
    }

    /**
     * Returns a user json found by the OAuth user_id
     * @param string $oauth_user_id the unqiue identifier of the oauth provider
     * @return string a JSON-encoded user object
     */
    public function getUserByOAuthUserId($oauth_user_id)
    {
        $this->getDbProxy()->setWhere("oauth_user_id = '". $oauth_user_id . "'");

        $userData = json_decode($this->getDbProxy()->select(), true);
        if (count($userData) > 0) {
            $userData = $userData[0];
        }

        return json_encode($userData);
    }

    protected function getDefaultUserJson()
    {
        $user = array();
        $user['id'] = null;
        $user['name'] = "Anonymous";
        $user['username'] = "";
        $user['oauth_user_id'] = "";
        $user['oauth_provider'] = "";
        $user['token'] = "";
        $user["fix_count"] = 0;
        $user["vote_count"] = 0;
        $user["koin_count"] = 0;
        $user["pic_url"] = "";
        $user["logged_in"] = false;
        $user["secret"] = "";

        return json_encode($user);
    }

    /**
    * Get either a Gravatar URL or complete image tag for a specified email address.
    *
    * @param $size Size in pixels, defaults to 200px [ 1 - 2048 ]
    * @param $imageSet Default imageset to use [ 404 | mm | identicon | monsterid | wavatar ]
    * @param $rating Maximum rating (inclusive) [ g | pg | r | x ]
    * @return string containing the URL
    * @link http://gravatar.com/site/implement/images/php/
    */
    protected function getGravatarUrl ($email, $size = 200, $imageSet = 'mm', $rating = 'r')
    {
        $url = 'http://www.gravatar.com/avatar/';
        $url .= \md5(\strtolower(\trim($email)));
        $url .= "?s=$size&d=$imageSet&r=$rating";
        return $url;
    }
}
