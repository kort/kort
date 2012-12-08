<?php
/**
 * kort - Helper\SlimHelper class
 */

namespace Helper;

/**
 * The SlimHelper class is a helper for the Slim Framework and provides
 * common functions, which are used in the webservices.
 *
 * @link http://www.slimframework.com/
 *
 */
class SlimHelper
{
    /** the Slim application object */
    protected $app;

    /**
     * Creates a new instance of SlimHelper
     * @param Slim\Slim the Slim application object
     */
    public function __construct($app)
    {
        $this->app = $app;
    }

    /**
     * Writes the provided data in the response.
     *
     * This function takes care of if $data is empty or not.
     *
     * @param string $data data to return to the client in JSON-format
     */
    public function returnData($data)
    {
        if (empty($data)) {
            $data = '[]';
        }
        $this->app->response()->write("{\"return\": ". $data . "}");
    }

    /**
     * Check if the provided $user_id matches the logged-in user
     * @param mixed $user_id
     * @return bool true if it's the logged in user, false otherwise.
     */
    public function checkUserId($user_id)
    {
        if (!isset($_SESSION) || $user_id != $_SESSION['user_id']) {
            $this->app->response()->status(403);
            $this->app->response()->write("Wrong user_id");
            return false;
        }
        return true;
    }
}
