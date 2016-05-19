<?php
/**
 * kort - Helper\SlimAuthMiddleware class
 */
namespace Helper;

use Webservice\User\UserGetHandler;

/**
 * The SlimAuthMiddleware class provides an authentication middleware for Slim.
 */
class SlimAuthMiddleware extends \Slim\Middleware
{
    /**
     * @var string
     */
    protected $realm;
    /**
     * @var string
     */
    protected $username;
    /**
     * @var string
     */
    protected $password;
    /**
     * Constructor
     *
     * @param string $realm The HTTP Authentication realm.
     */
    public function __construct($realm = 'Protected Area')
    {
        $this->realm = $realm;
    }
    /**
     * Call
     *
     * This method will check the HTTP request headers for previous authentication. If
     * the request has already authenticated, the next middleware is called. Otherwise,
     * a 401 Authentication Required response is returned to the client.
     *
     * @return void
     */
    public function call()
    {
        $req = $this->app->request();
        $res = $this->app->response();
        $authUser = $req->headers('PHP_AUTH_USER');
        $authPass = $req->headers('PHP_AUTH_PW');

        $userGetHandler = new UserGetHandler();
        $userAuthenticated = $userGetHandler->userExists($authUser, $authPass);

        $path =  $req->getPath();

        if (!preg_match('@^.*/webservices/.*$@', $path)) {
            $this->next->call();
            return;
        }

        $openRoutes = array(
            '.*/user/verify/.*',
            '.*/statistics.*'
        );

        foreach ($openRoutes as $openRoute) {
            if (preg_match('@^' . $openRoute . '$@', $path)) {
                $this->next->call();
                return;
            }
        }


        if ($userAuthenticated) {
            $this->next->call();
        } else {
            $res->status(401);
            $res->header('WWW-Authenticate', sprintf('Basic realm="%s"', $this->realm));
        }
    }
}
