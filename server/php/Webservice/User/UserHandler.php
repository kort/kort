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
            'oauth_user_id',
            'username',
            'oauth_provider',
            'token',
            'secret'
        );
    }

    protected function getReturnFields()
    {
        return array(
            'user_id',
            'name',
            'username',
            'oauth_user_id',
            'secret'
        );
    }

    public function updateUser($id, $data)
    {
        $this->getDbProxy()->setReturnFields($this->getReturnFields());
        $this->getDbProxy()->setWhere("user_id = " . $id);
        return $this->getDbProxy()->update($data);
    }

    public function insertUser($data)
    {
        $this->getDbProxy()->setReturnFields($this->getReturnFields());
        return $this->getDbProxy()->insert($data);
    }
}
