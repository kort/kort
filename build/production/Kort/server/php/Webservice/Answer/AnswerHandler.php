<?php
/**
 * kort - Webservice\Answer\AnswerHandler class
 */
namespace Webservice\Answer;

use Webservice\DbProxyHandler;

/**
 * The AnswerHandler class is used to handle requests to the answer webservices.
 */
class AnswerHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     *
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.select_answer';
    }

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array('id', 'value', 'title', 'sorting', 'type');
    }

    /**
     * Returns all answers of all types.
     *
     * @return string all answers of all types
     */
    public function getAllAnswers()
    {
        $this->getDbProxy()->setOrderBy('sorting');
        return $this->select();
    }

    /**
     * Returns the selected answers.
     *
     * @return string JSON-encoded bugs
     */
    protected function select()
    {
        $data = json_decode($this->getDbProxy()->select(), true);
        $data = array_map(array($this, "translateAnswer"), $data);
        return json_encode($data);
    }

    /**
     * Returns all answers of a specific type.
     *
     * @param string $type The type of answer.
     *
     * @return string ll answers of the specific type
     */
    public function getSpecificAnswers($type)
    {
        $this->getDbProxy()->setWhere("type = '" . $type ."'");
        $this->getDbProxy()->setOrderBy('sorting');
        return $this->select();
    }

    /**
     * Translate all texts of an answer.
     *
     * @param array $answer The answer to translate.
     *
     * @return array the translated answer
     */
    public function translateAnswer(array $answer)
    {
        $answer['title'] = $this->translate($answer['title']);
        return $answer;
    }
}
