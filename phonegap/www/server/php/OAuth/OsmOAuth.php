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

    /**
     * The url of the user webservice of OpenStreetMap.
     *
     * @var string
     */
    protected $userUrl = "http://api.openstreetmap.org/api/0.6/user/details";

    /**
     * The server url of OpenStreetMap.
     *
     * @var string
     */
    protected $serverUrl = "http://www.openstreetmap.org";

    /**
     * The authorize url of OpenStreetMap.
     *
     * @var string
     */
    protected $authorizeUrl = "http://www.openstreetmap.org/oauth/authorize";

    /**
     * The access token url of OpenStreetMap.
     *
     * @var string
     */
    protected $accessTokenUrl = "http://www.openstreetmap.org/oauth/access_token";

    /**
     * The request token url of OpenStreetMap.
     *
     * @var string
     */
    protected $requestTokenUrl = "http://www.openstreetmap.org/oauth/request_token";

    /**
     * The consumer key.
     *
     * @var string
     */
    protected $key;

    /**
     * The consumer secret.
     *
     * @var string
     */
    protected $secret;

    /**
     * The received OAuthToken.
     *
     * @var string
     */
    protected $oauthToken;

    /**
     * Creates a new instance of OsmOAuth.
     *
     * @param string  $key      The consumer key.
     * @param string  $secret   The consumer secret.
     * @param boolean $unitTest Determines wheter this call is made from a unit test or not.
     */
    public function __construct($key, $secret, $unitTest = false)
    {
        $this->key = $key;
        $this->secret = $secret;
        if (!$unitTest) {
            \OAuthStore::instance("Session", $this->getOauthOptions());
        }
    }

    /**
     * Returns an array of options for OAuth.
     *
     * @return array Options for OAuth
     */
    protected function getOauthOptions()
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
     * @param string $oauthToken The autentication code from Google.
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
    public function getOauthUser()
    {
        if (empty($this->user)) {
            $request = new \OAuthRequester($this->userUrl, "GET", $_GET);
            $result = $request->doRequest();

            $doc = new \DOMDocument();
            $doc->loadXML($result['body']);
            $xPath = new \DOMXpath($doc);
            
            $userTag = $doc->getElementsByTagName("user")->item(0);
            $this->user['name'] = $userTag->getAttribute('display_name');
            $this->user['id'] = $userTag->getAttribute('id');
            
            $imgTags = $xPath->query("//user/img");
            if ($imgTags->length > 0) {
                $this->user['pic_url'] = $imgTags->item(0)->getAttribute('href');
            }
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
        return $user['id'];
    }
    
    /**
     * Return the URL of the user's picture (avatar).
     *
     * @return string URL of the user's picutre
     */
    public function getPictureUrl()
    {
        $user = $this->getOauthUser();
        return $user['pic_url'];
    }

    /**
     * The name of the OAuth provider.
     *
     * @return string Name of the OAuth provider
     */
    public function getOauthProvider()
    {
        return "OpenStreetMap";
    }

    /**
     * Returns the URL where a user must authorize.
     *
     * @return string URL to authorize the user
     */
    public function getAuthorizeUrl()
    {
        $token = $this->getRequestToken();
        return $this->authorizeUrl . "?oauth_token=" . $token['token'];
    }

    /**
     * Returns the request token.
     *
     * @return string The request token.
     */
    protected function getRequestToken()
    {
        $result = \OAuthRequester::requestRequestToken($this->key, 0, null);
        return $result;
    }

    /**
     * Returns the file name of the correct secret file based on the environment.
     *
     * @param string $host The current host (only used in unit testing).
     *
     * @return string the file name of the correct secret file.
     */
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
