<?php
/**
 * kort - OAuth\AbstractOAuthCallback class
 */
namespace OAuth;

use Webservice\User\UserHandler;
use Webservice\User\UserGetHandler;
use Helper\SecretGenerator;

/**
 * The AbstractOAuthCallback class specifies common OAuth functionality.
 *
 * It must be extended by each OAuth provider
 */
abstract class AbstractOAuthCallback
{
    /**
     * Authenticate against the OAuth provider.
     *
     * @param mixed $code The autentication code.
     *
     * @return void
     */
    abstract public function authenticate($code);

    /**
     * Returns the OAuth refresh token, which typically lives a long time.
     *
     * @return string The OAuth refresh token
     */
    abstract public function getRefreshToken();

    /**
     * Returns the OAuth access token for this session.
     *
     * @return string The OAuth access token for this session
     */
    abstract protected function getAccessToken();

    /**
     * Returns an array with user infos from the OAuth provier.
     *
     * @return array The OAuth user infos
     */
    abstract public function getOauthUser();

    /**
     * Returns an identifier for this OAuth user.
     *
     * @return mixed Identifier for this OAuth user
     */
    abstract protected function getOauthUserId();

    /**
     * The name of the OAuth provider.
     *
     * @return string Name of the OAuth provider
     */
    abstract public function getOauthProvider();
    
    /**
     * The URL of the user's picture (avatar).
     * 
     * If this value is empty, Gravatar is used to get a picure.
     *
     * @return string URL of the user's picutre
     */
    abstract public function getPictureUrl();

    /**
     * Returns an array with all currently known user details.
     *
     * @return array The current user array
     */
    public function getUser()
    {
        $user = $this->getOauthUser();
        $user['oauth_provider'] = $this->getOauthProvider();
        $user['oauth_user_id'] = $this->getOauthUserId();
        $user['pic_url'] = $this->getPictureUrl();
        return $user;
    }

    /**
     * Returns the user info array from the application.
     *
     * @return array User info array from the application
     */
    protected function getApplicationUser()
    {
        $userGetHandler = new UserGetHandler();
        $userDataJson = $userGetHandler->getUserByOauthUserId($this->getOauthUserId());

        return json_decode($userDataJson, true);
    }

    /**
     * Updates or insert an application user.
     *
     * @return array The updated/inserted user from the database
     */
    public function saveApplicationUser()
    {
        $user = $this->getUser();
        $appUser = $this->getApplicationUser();

        if (empty($appUser)) {
            $dbUser = $this->insertApplicationUser($user);
        } else {
            $dbUser = $this->updateApplicationUser($appUser, $user);
        }
        return json_decode($dbUser, true);
    }

    /**
     * Insert a user into the database.
     *
     * @param array $user Array of user infos from OAuth.
     *
     * @return array The inserted user from the database
     */
    protected function insertApplicationUser(array $user)
    {
        $userHandler = new UserHandler();
        $generator = new SecretGenerator();
        $user['secret'] = $generator->getSecret();
        $user['token'] = $this->getRefreshToken();

        $dbUser = $userHandler->insertUser($user);
        return $dbUser;
    }

    /**
     * Update a user from the database.
     *
     * @param array $appUser Array of user infos from the application.
     * @param array $user    Array of user infos from OAuth.
     *
     * @return array The updated user from the database
     */
    protected function updateApplicationUser(array $appUser, array $user)
    {
        $userHandler = new UserHandler();
        $dbUser = $userHandler->updateUser($appUser['id'], $user);
        return $dbUser;
    }

    /**
     * Returns the URL of the application.
     *
     * @return string The URL of the application
     */
    public function getApplicationUrl()
    {
        $appUrl = 'http://' . $_SERVER['HTTP_HOST'];
        if ($_SERVER['HTTP_HOST'] === "localhost") {
            $appUrl .= "/kort";

            if (isset($_GET['state']) && !empty($_GET['state'])) {
                $appUrl .= "/build/" . $_GET['state'] . "/Kort/";
            }
        }
        return $appUrl;
    }
}
