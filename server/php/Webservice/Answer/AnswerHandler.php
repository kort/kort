<?php
namespace Webservice\Answer;

use Webservice\DbProxyHandler;

class AnswerHandler extends DbProxyHandler
{
    protected $table = 'kort.select_answer';
    protected $fields = array('id', 'value', 'title', 'sorting', 'type');

    public function getAllAnswers($limit)
    {
        $this->getDbProxy()->setLimit($limit);
        $this->getDbProxy()->setOrderBy = 'sorting';
        return $this->getFromDb();
    }

    public function getSpecificAnswers($type, $limit)
    {
        $this->getDbProxy()->setLimit($limit);
        $this->getDbProxy()->setOrderBy = 'sorting';
        $this->getDbProxy()->setWhere = "type = '" . $type ."'";
        return $this->getDbProxy()->getFromDb();
    }
}
