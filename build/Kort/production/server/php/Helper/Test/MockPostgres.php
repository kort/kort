<?php
namespace Helper;

use \Mockery as M;

function pg_connect($connectionString)
{
    return M::mock();
}

function pg_query($dbConn, $sql)
{
    return array();
}
