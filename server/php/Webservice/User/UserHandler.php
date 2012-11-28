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
            'name',
            'email',
            'username',
            'oauth_provider',
            'token'
        );
    }

    public function updateUser($id, $data)
    {
        $this->getDbProxy()->setWhere("user_id = " . $id);
        $this->getDbProxy()->update($data);
    }

    public function insertUser($data)
    {
        $this->getDbProxy()->setReturnFields(
                array(
                   'user_id',
                   'name',
                   'username',
                   'email'
                )
        );
        return json_decode($this->getDbProxy()->insert($data), true);
    }
}
