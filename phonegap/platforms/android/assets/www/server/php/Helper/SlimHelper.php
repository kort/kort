<?php
/**
 * kort - Helper\SlimHelper class
 */
namespace Helper;

/**
 * The SlimHelper class is a helper for the Slim Framework.
 *
 * It provides common functions, which are used in the webservices.
 */
class SlimHelper
{
    /**
     * The Slim application object.
     *
     * @var Slim\Slim
     */
    protected $app;

    /**
     * Creates a new instance of SlimHelper.
     *
     * @param mixed $app The Slim application object.
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
     * @param string $data Data to return to the client in JSON-format.
     *
     * @return void
     */
    public function returnData($data)
    {
        if (empty($data)) {
            $data = '[]';
        }
        $this->app->response()->write("{\"return\":". $data . "}");
    }

    /**
     * Check if the provided $user_id matches the logged-in user.
     *
     * @param mixed $user_id The user id.
     *
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
