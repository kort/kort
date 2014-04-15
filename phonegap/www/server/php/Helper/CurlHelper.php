<?php
/**
 * kort - Helper\CurlHelper class
 */
namespace Helper;

/**
 * The CurlHelper class is a wrapper around the curl function of PHP.
 *
 * It is used to simplify the access to these functions and to easily mock for testing.
 */
class CurlHelper
{
    /**
     * The curl handler on which all functions are applied.
     *
     * @var mixed the current curl connection
     */
    protected $curl;

    /**
     * Creates a new instance of CurlHelper.
     */
    public function __construct()
    {
        $this->curl = \curl_init();
    }

    /**
     * Sets a curl option.
     *
     * @param integer $option A curl option.
     * @param mixed   $value  The corresponding value.
     *
     * @return bool true on success or false on failure.
     */
    public function setOption($option, $value)
    {
        return curl_setopt($this->curl, $option, $value);
    }

    /**
     * Executes the configured curl request.
     *
     * @return mixed the result on success, false on failure.
     */
    public function execute()
    {
        return curl_exec($this->curl);
    }

    /**
     * Closes the connection to the remote site.
     *
     * @return void
     */
    public function close()
    {
        curl_close($this->curl);
    }
}
