<?php
namespace Webservice\Answer;

use Webservice\DbProxyHandler;

class AnswerHandler extends DbProxyHandler
{
    protected $table = 'kort.select_answer';
    protected $fields = array('id', 'value', 'title', 'sorting');

    public function getAllAnswers()
    {
        $this->getDbProxy()->setOrderBy = 'sorting';
        return $this->getFromDb();
    }

    public function getSpecificAnswers($type)
    {
       $this->getDbProxy()->setOrderBy = 'sorting';
       $this->getDbProxy()->setWhere = "type = '" . $type ."'";
       return $this->getDbProxy()->getFromDb();
    }
}
