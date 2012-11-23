<?php
namespace Webservice\User;

use Webservice\DbProxyHandler;

class UserHandler extends DbProxyHandler
{
    protected $table = 'kort.user';
    protected $fields = array(
        'user_id',
        'name',
        'email',
        'username',
        'token'
    );

    public function updateUser($id, $data)
    {
        //$this->getDbProxy()->updateDb($id, $data);
    }

    public function insertUser($data)
    {
        // TODO implement insertUser
    }
}
