<?php
namespace Helper;

class SlimHelper {
    protected $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function returnData($data)
    {
        if(empty($data)) {
            $data = '[]';
        }
        $this->app->response()->write("{\"return\": ". $data . "}");
    }

    public function checkUserId($id)
    {
        if (!isset($_SESSION) || $id != $_SESSION['user_id']) {
            $this->app->response()->status(403);
            $this->app->response()->write("Wrong user_id");
            return false;
        }
        return true;
    }
}
