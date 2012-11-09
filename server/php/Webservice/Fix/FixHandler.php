<?php
namespace Webservice\Fix;

use Webservice\Database\AbstractDbHandler;

class FixHandler extends AbstractDbHandler
{
    protected $fixTable = 'kort.fix';
    protected $fixFields = array(
        'id',
        'create_date',
        'error_id',
        'message'
    );

    public function insertFix($postVariables)
    {
        $data = array();
        foreach ($this->fixFields as $key) {
            if (array_key_exists($key, $postVariables)) {
                $data[$key] = $this->db->escapeLitereal($postVariables[$key]);
            }
        }
        $data['id'] = "nextval('kort.fix_id')";
        $data['create_date'] = "now()";

        $this->db->doInsertQuery($data, $this->fixTable);
    }
}
