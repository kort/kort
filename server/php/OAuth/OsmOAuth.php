<?php
/**
 * kort - OAuth\OsmOAuth class
 */
namespace OAuth;

use Helper\HttpHelper;

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
    protected $user = null;

    protected $http;

    //protected $requestTokenUrl = "http://api06.dev.openstreetmap.org/oauth/request_token";
    protected $requestTokenUrl = "http://www.openstreetmap.org/oauth/request_token";
    protected $accessTokenUrl = "http://api06.dev.openstreetmap.org/oauth/access_token";
    protected $authorizeUrl = "http://api06.dev.openstreetmap.org/oauth/authorize";

    /**
     * Creates a new instance of GoogleOAuth.
     */
    public function __construct()
    {
        $this->http = new HttpHelper();
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
    public function getOAuthUser()
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
    protected function getOAuthUserId()
    {
        $user = $this->getOAuthUser();
        return $user['email'];
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


    public function getAccessTokenUrl()
    {
        return $this->accessTokenUrl;
    }

    public function getRequestTokenUrl()
    {
        return $this->requestTokenUrl;
    }

    public function getAuthorizeUrl()
    {
        $token = $this->getRequestToken();

        return $token;

        //return $this->authorizeUrl . '?oauth_token=' . $token->oauth_token;
    }

    protected function getRequestToken()
    {
        $url = $this->requestTokenUrl;
        $urlParts = parse_url($url);

        $headers = array('Expect:');
        $headers[] = 'Authorization: OAuth realm="' . $urlParts['path'] . '",';
        $this->http->setOption(CURLOPT_HTTPHEADER, $headers);

        return $this->http->get($this->requestTokenUrl);
    }
}
