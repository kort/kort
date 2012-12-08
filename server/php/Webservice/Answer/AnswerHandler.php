<?php
/**
 * kort - Webservice\Answer\AnswerHandler class
 */
namespace Webservice\Answer;

use Webservice\DbProxyHandler;

/**
 * The AnswerHandler class is used to handle requests to the answer webservices
 */
class AnswerHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.select_answer';
    }

    /**
     * Returns the table fields used by this handler.
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array('id', 'value', 'title', 'sorting', 'type');
    }

    /**
     * Returns all answers of all types
     * @return all answers of all types
     */
    public function getAllAnswers()
    {
        $this->getDbProxy()->setOrderBy('sorting');
        return $this->getDbProxy()->select();
    }

    /**
     * Returns all answers of a specific type
     * @param string $type the type of answer
     * @return all answers of the specific type
     */
    public function getSpecificAnswers($type)
    {
        $this->getDbProxy()->setWhere("type = '" . $type ."'");
        $this->getDbProxy()->setOrderBy('sorting');
        return $this->getDbProxy()->select();
    }
}
