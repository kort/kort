<?php
namespace Webservice\Fix;

use Webservice\DbProxyHandler;
use Model\Badge;
use Model\Reward;

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

        $koins = 100;
        $badge = new Badge("bla_badge");
        $reward = new Reward($koins, array($badge));
        return $reward->toJson();
    }
}
