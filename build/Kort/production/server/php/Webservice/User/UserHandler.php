<?php
/**
 * kort - Webservice\User\UserHandler class
 */
namespace Webservice\User;

use Webservice\DbProxyHandler;

/**
 * The UserHandler class handles all POST and PUT requests to the user webservice.
 */
class UserHandler extends DbProxyHandler
{
    /**
     * Returns the database table to be used with this Handler.
     *
     * @return the database table as a string
     */
    protected function getTable()
    {
        return 'kort.user';
    }

    /**
     * Returns the database fields to be used with this Handler.
     *
     * @return an array of database fields
     */
    protected function getFields()
    {
        return array(
            'user_id',
            'name',
            'oauth_user_id',
            'username',
            'pic_url',
            'oauth_provider',
            'token',
            'secret'
        );
    }

    /**
     * Return the database fields to return when executing insert or update.
     *
     * @return array of database fields
     */
    protected function getReturnFields()
    {
        return array(
            'user_id',
            'name',
            'username',
            'pic_url',
            'oauth_user_id',
            'secret'
        );
    }

    /**
     * Updates a user with newer data.
     *
     * @param integer $id   The user id.
     * @param array   $data The user data.
     *
     * @return string JSON-encoded updated user
     */
    public function updateUser($id, array $data)
    {
        $this->getDbProxy()->setReturnFields($this->getReturnFields());
        $this->getDbProxy()->setWhere("user_id = " . $id);
        return $this->getDbProxy()->update($data);
    }

    /**
     * Insert a new user.
     *
     * @param array $data The user data.
     *
     * @return string JSON-encoded user
     */
    public function insertUser(array $data)
    {
        $this->getDbProxy()->setReturnFields($this->getReturnFields());
        return $this->getDbProxy()->insert($data);
    }
}
