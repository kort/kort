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
            'oauth_provider',
            'token'
        );
    }

    protected function getReturnFields()
    {
        return array(
            'user_id',
            'name',
            'username',
            'email'
        );
    }

    public function updateUser($id, $data)
    {
        $this->getDbProxy()->setReturnFields($this->getReturnFields());
        $this->getDbProxy()->setWhere("user_id = " . $id);
        return json_encode($this->getDbProxy()->update($data));
    }

    public function insertUser($data)
    {
        $this->getDbProxy()->setReturnFields($this->getReturnFields());
        return json_encode($this->getDbProxy()->insert($data));
    }
}
