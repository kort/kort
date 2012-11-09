<?php
namespace Webservice\Fix;

use Webservice\Database\AbstractDbHandler;

class FixHandler extends AbstractDbHandler
{

    public function insertFix($postVariables)
    {
        unset($postVariables['id']);
        $this->db->doInsertQuery($postVariables);
    }
}
