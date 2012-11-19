<?php
namespace Webservice\Answer;

use Webservice\RelayHandler;

class AnswerHandler extends RelayHandler
{
    protected $table = 'kort.select_answer';
    protected $fields = array('id', 'value', 'title', 'sorting');

    public function getAllAnswers()
    {
        $this->orderBy = 'sorting';
        return $this->getFromDb();
    }

    public function getSpecificAnswers($type)
    {
        $this->orderBy = 'sorting';
        $this->where = "type = '" . $type ."'";
        return $this->getFromDb();
    }
}
