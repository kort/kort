<?php
namespace Webservice\Answer;

use Webservice\RelayHandler;

class AnswerHandler extends RelayHandler
{
    protected $table = 'kort.select_answer';
    protected $fields = array('id', 'type_key', 'title', 'sorting');

    public function getAnswers()
    {
        $this->orderBy = 'sorting';
        return $this->getFromDb();
    }
}
