<?php
/**
 * kort - Webservice\User\UserGetHandler class
 */
namespace Webservice\User;

use Webservice\DbProxyHandler;
use Helper\GravatarHelper;

/**
 * The UserGetHandler class handles all GET requests to the user webservice.
 */
class UserGetHandler extends DbProxyHandler
{
    /**
     * Returns the database table to be used with this Handler.
     *
     * @return the database table as a string
     */
    protected function getTable()
    {
        return 'kort.user_model';
    }

    /**
     * Returns the database fields to be used with this Handler.
     *
     * @return an array of database fields
     */
    protected function getFields()
    {
        return array(
            'id',
            'name',
            'username',
            'pic_url',
            'oauth_user_id',
            'oauth_provider',
            'token',
            'fix_count',
            'vote_count',
            'koin_count',
            'ranking',
            'rownumber',
            'secret'
        );
    }

    /**
     * Returns a user identified by his specific secret.
     *
     * @param string $secret The user's secret.
     *
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
                if (empty( $userData['pic_url'])) {
                    $userData['pic_url'] = GravatarHelper::getGravatarUrl($userData['oauth_user_id']);
                }
                $userData['logged_in'] = true;
                return json_encode($userData);
            }
        }
        return $this->getDefaultUserJson();
    }

    /**
     * Returns a user json found by the OAuth user_id.
     *
     * @param string $oauth_user_id The unqiue identifier of the oauth provider.
     *
     * @return string|bool a JSON-encoded user object if successfull, false otherwise
     */
    public function getUserByOauthUserId($oauth_user_id)
    {
        $this->getDbProxy()->setWhere("oauth_user_id = '". $oauth_user_id . "'");

        $userData = $this->getDbProxy()->select();
        if (!$userData) {
            return false;
        }

        $userData = json_decode($userData, true);
        if (count($userData) > 0) {
            $userData = $userData[0];
        }

        return json_encode($userData);
    }

    /**
     * Returns a default user, which is used when the user is not yet logged in.
     *
     * @return string the JSON-encoded default user object
     */
    protected function getDefaultUserJson()
    {
        $user = array();
        $user['id'] = null;
        $user['name'] = "Anonymous";
        $user['username'] = "";
        $user['oauth_user_id'] = "";
        $user['oauth_provider'] = "";
        $user['token'] = "";
        $user['fix_count'] = 0;
        $user['vote_count'] = 0;
        $user['koin_count'] = 0;
        $user['ranking'] = 0;
        $user['pic_url'] = "";
        $user['logged_in'] = false;
        $user['secret'] = "";

        return json_encode($user);
    }
}
