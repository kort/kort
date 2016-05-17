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
    protected $accessToken = null;

    protected $refreshToken = null;

    protected $oauthUserId = null;
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
     * Verify a given token again the OAuth provider.
     *
     * @param mixed $idToken The id token to verify.
     *
     * @return boolean True if verification was successful, false otherwise
     */
    public function verify($idToken) {
        try {
            // Client library can verify the ID token.
            $jwt = $this->client->verifyIdToken($idToken)->getAttributes();
            $this->oauthUserId = $jwt['payload']['email'];
            return $jwt;
        } catch (\Google_AuthException $e) {
            return false;
        }
    }

    /**
     * Returns the OAuth access token for this session.
     *
     * @return string The OAuth access token for this session
     */
    protected function getAccessToken()
    {
        if (empty($this->accessToken)) {
            $this->accessToken = $this->client->getAccessToken();
        }
        return $this->accessToken;
    }

    /**
     * Returns the OAuth refresh token, which typically lives a long time.
     *
     * @return string The OAuth refresh token
     */
    public function getRefreshToken()
    {
        if (empty($this->refreshToken)) {
            $authObj = json_decode( $this->getAccessToken() );
            if ( isset( $authObj->refresh_token ) ) {
                $this->refreshToken = $authObj->refresh_token;
            }
        }
        return $this->refreshToken;
    }

    /**
     * Returns an array with user infos from the OAuth provier.
     *
     * @return array The current user array
     */
    public function getOauthUser()
    {
        if (!empty($this->oauthUserId)) {
            return array();
        }
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
        if (empty($this->oauthUserId)) {
            $user = $this->getOauthUser();
            if (!empty($user)) {
                $this->oauthUserId = $user['email'];
            }
        }
        return $this->oauthUserId;
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
     * @return string URL of the user's picture
     */
    public function getPictureUrl()
    {
        $user = $this->getOauthUser();
        if (empty($user)) {
            return "";
        }
        return $user['picture'];
    }
}
