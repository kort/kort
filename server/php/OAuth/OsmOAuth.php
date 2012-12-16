<?php
/**
 * kort - OAuth\OsmOAuth class
 */
namespace OAuth;

/**
 * The OsmOAuth class takes care about the login with OpenStreetMap.
 */
class OsmOAuth extends AbstractOAuthCallback
{
    /**
     * The current user.
     *
     * @var array
     */
    protected $user = array();
    protected $userUrl = "http://api.openstreetmap.org/api/0.6/user/details";

    protected $serverUrl = "http://www.openstreetmap.org";
    protected $authorizeUrl = "http://www.openstreetmap.org/oauth/authorize";
    protected $accessTokenUrl = "http://www.openstreetmap.org/oauth/access_token";
    protected $requestTokenUrl = "http://www.openstreetmap.org/oauth/request_token";

    protected $key;
    protected $secret;
    protected $oauthToken;

    /**
     * Creates a new instance of GoogleOAuth.
     */
    public function __construct($key, $secret, $unitTest = false)
    {
        $this->key = $key;
        $this->secret = $secret;
        if (!$unitTest) {
            \OAuthStore::instance("Session", $this->getOAuthOptions());
        }
    }

    protected function getOAuthOptions()
    {
        $options = array(
            'consumer_key'      => $this->key,
            'consumer_secret'   => $this->secret,
            'server_uri'        => $this->serverUrl,
            'request_token_uri' => $this->requestTokenUrl,
            'authorize_uri'     => $this->authorizeUrl,
            'access_token_uri'  => $this->accessTokenUrl
        );
        return $options;
    }

    /**
     * Authenticate against the OAuth provider.
     *
     * @param string $code The autentication code from Google.
     *
     * @return void
     */
    public function authenticate($oauthToken)
    {
        $this->oauthToken = $oauthToken;
        try {
            \OAuthRequester::requestAccessToken($this->key, $oauthToken, 0, 'POST', $_GET);
        } catch (\OAuthException2 $e) {
            echo "authenticate Exception:<pre>";
            print_r($e);
            echo "</pre>";
        }
    }

    /**
     * Returns the OAuth access token for this session.
     *
     * @return string The OAuth access token for this session
     */
    protected function getAccessToken()
    {
        return $this->oauthToken;
    }

    /**
     * Returns the OAuth refresh token, which typically lives a long time.
     *
     * @return string The OAuth refresh token
     */
    public function getRefreshToken()
    {
        // currently OSM does not distinguish between refresh and access token,
        // i.e the access token never expires.
        return $this->getAccessToken();
    }

    /**
     * Returns an array with user infos from the OAuth provier.
     *
     * @return array The current user array
     */
    public function getOAuthUser()
    {
        if (empty($this->user)) {
            $request = new \OAuthRequester($this->userUrl, "GET", $_GET);
            $result = $request->doRequest();

            $doc = new \DOMDocument();
            $doc->loadXML($result['body']);
            $userTag = $doc->getElementsByTagName("user")->item(0);

            $this->user['name'] = $userTag->getAttribute('display_name');
            $this->user['id'] = $userTag->getAttribute('id');
        }
        return $this->user;
    }

    /**
     * Returns an identifier for this OAuth user.
     *
     * @return mixed Identifier for this OAuth user
     */
    protected function getOAuthUserId()
    {
        $user = $this->getOAuthUser();
        return $user['id'];
    }

    /**
     * The name of the OAuth provider.
     *
     * @return string Name of the OAuth provider
     */
    public function getOAuthProvider()
    {
        return "OpenStreetMap";
    }

    public function getAuthorizeUrl()
    {
        $token = $this->getRequestToken();
        return $this->authorizeUrl . "?oauth_token=" . $token['token'];
    }

    protected function getRequestToken()
    {
        $result = \OAuthRequester::requestRequestToken($this->key, 0, null);
        return $result;
    }

    public static function getSecretFile($host = null)
    {
        if (empty($host)) {
            $host = $_SERVER['HTTP_HOST'];
        }

        if ($host == "localhost") {
            $env = $host;
        } else {
            $matches = array();
            preg_match("/([a-z-]*)\.(.*)/", $host, $matches);
            $env = $matches[1];
        }
        return "secret_" . $env . ".php";
    }
}
