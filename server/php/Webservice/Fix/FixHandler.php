<?php
namespace Webservice\Fix;

use Webservice\DbProxyHandler;

class FixHandler extends DbProxyHandler
{
    protected $dbProxy;
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

        $this->getDbProxy()->postToDb($data);
    }
}
