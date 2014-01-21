<?php
/**
 * kort - OAuth\FacebookOAuth class
 */
namespace OAuth;

/**
 * The GoogleOAuth class takes care about the login with Google.
 */
class FacebookOAuth extends AbstractOAuthCallback
{
    /**
     * The current user.
     *
     * @var array
     */
    protected $user = null;

    /**
     * The api key of the kort application.
     *
     * @var string
     */
    private $app_id = "290615117735384";

    /**
     * The app secret of the kort application.
     *
     * @var string
     */
    private $app_secret = "778070fcfea0bad67c0d3131f0e33260";

    /**
     * The callback url.
     *
     * @var string
     */
    private $my_url = "";

    /**
     * The facebook access token.
     *
     * @var string
     */
    private $accessToken = null;

    /**
     * Creates a new instance of FacebookOAuth.
     */
    public function __construct()
    {
        $this->my_url="http://" . $_SERVER['HTTP_HOST'] . "/server/oauth2callback/facebook";
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
        $token_url = "https://graph.facebook.com/oauth/access_token?"
            . "client_id=" . $this->app_id . "&redirect_uri=" . urlencode($this->my_url)
            . "&client_secret=" . $this->app_secret . "&code=" . $code;

        $response = file_get_contents($token_url);
        $params = null;
        parse_str($response, $params);
        $this->accessToken=$params['access_token'];
    }

    /**
     * Returns the OAuth access token for this session.
     *
     * @return string The OAuth access token for this session
     */
    protected function getAccessToken()
    {
        return $this->accessToken;
    }

    /**
     * Returns the OAuth refresh token, which typically lives a long time.
     *
     * @return string The OAuth refresh token
     */
    public function getRefreshToken()
    {
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
            $graph_url = "https://graph.facebook.com/me?access_token=" . $this->accessToken;
            $this->user = json_decode(file_get_contents($graph_url), true);
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
        return "Facebook";
    }
    
    /**
     * The URL of the user's picture (avatar).
     *
     * @return string URL of the user's picutre
     */
    public function getPictureUrl()
    {
        $user = $this->getOauthUser();
        return 'https://graph.facebook.com/'.$user['id'].'/picture?width=80&height=80';
    }
}
