<?php
namespace Webservice\Fix;

use Webservice\RelayHandler;

class FixHandler extends RelayHandler
{
    protected $table = 'kort.fix';
    protected $fields = array(
        'id',
        'create_date',
        'error_id',
        'message'
    );

    public function insertFix($data)
    {
        $data['id'] = "nextval('kort.fix_id')";
        $data['create_date'] = "now()";

        $this->postToDb($data);
    }
}
