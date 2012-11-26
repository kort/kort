<?php
namespace Webservice\User;

use Webservice\DbProxyHandler;

class UserHandler extends DbProxyHandler
{
    protected function getTable()
    {
        return 'kort.user';
    }

    protected function getFields()
    {
        return array(
            'user_id',
            'name',
            'email',
            'username',
            'token'
        );
    }

    public function updateUser($id, $data)
    {
        //$this->getDbProxy()->updateDb($id, $data);
    }

    public function insertUser($data)
    {
        // TODO implement insertUser
    }
}
