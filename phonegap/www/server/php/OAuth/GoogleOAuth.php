<?php
/**
 * kort - OAuth\GoogleOAuth class
 */
namespace OAuth;

/**
 * The GoogleOAuth class takes care about the login with Google.
 */
class GoogleOAuth extends AbstractOAuthCallback
{
    /**
     * The Google API Client.
     *
     * @var Google_Client
     */
    protected $client;

    /**
     * The Google OAuth Service to receive user data.
     *
     * @var Google_Oauth2Service
     */
    protected $oAuthService;

    /**
     * The current user.
     *
     * @var array
     */
    protected $user = null;

    /**
     * Creates a new instance of GoogleOAuth.
     */
    public function __construct()
    {
        $this->client = new \Google_Client();
        $this->oAuthService = new \Google_Oauth2Service($this->client);
    }

    /**
     * Authenticate against the OAuth provider.
     *
     * @param string $code The autentication code from Google.
     *
     * @return void
     */
    public function authenticate($code)
    {
        $this->client->authenticate($code);
    }

    /**
     * Returns the OAuth access token for this session.
     *
     * @return string The OAuth access token for this session
     */
    protected function getAccessToken()
    {
        return $this->client->getAccessToken();
    }

    /**
     * Returns the OAuth refresh token, which typically lives a long time.
     *
     * @return string The OAuth refresh token
     */
    public function getRefreshToken()
    {
        $authObj = json_decode($this->getAccessToken());
        if (isset($authObj->refresh_token)) {
            return $authObj->refresh_token;
        }
        return null;
    }

    /**
     * Returns an array with user infos from the OAuth provier.
     *
     * @return array The current user array
     */
    public function getOauthUser()
    {
        if (empty($this->user)) {
            $this->user = $this->oAuthService->userinfo->get();
        }
        return $this->user;
    }

    /**
     * Returns an identifier for this OAuth user.
     *
     * @return mixed Identifier for this OAuth user
     */
    protected function getOauthUserId()
    {
        $user = $this->getOauthUser();
        return $user['email'];
    }

    /**
     * The name of the OAuth provider.
     *
     * @return string Name of the OAuth provider
     */
    public function getOauthProvider()
    {
        return "Google";
    }
    
    /**
     * The URL of the user's picture (avatar).
     *
     * @return string URL of the user's picutre
     */
    public function getPictureUrl()
    {
        $user = $this->getOauthUser();
        return $user['picture'];
    }
}
