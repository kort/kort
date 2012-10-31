<?php
namespace Webservice\Database;

abstract class AbstractDbHandler
{
    protected $db;

    public function __construct()
    {
        set_error_handler( array( $this, 'handleError' ) );
        $this->db = new PsqlHelper(new DbConfig());
    }

    public function handleError($errno, $errstr, $errfile, $errline)
    {
        throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);;
    }
}
