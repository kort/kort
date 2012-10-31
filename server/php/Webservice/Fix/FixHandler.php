<?php
namespace Webservice\Fix;

use Webservice\Database\AbstractDbHandler;

class FixHandler extends AbstractDbHandler
{

    public function fixesRouteHandler($app)
    {
        $handler = $this;
        return function () use ($handler, $app) {
            $handler->insertFix($app->request()->post());
        };
    }

    public function insertFix($postVariables)
    {
        unset($postVariables['id']);
        $this->db->doInsertQuery($postVariables);
    }
}
