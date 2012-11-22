<?php
namespace Helper;

class CurlHelper
{
    protected $curl;

    public function __construct()
    {
        $this->curl = \curl_init();
    }

    public function setOption($option, $value)
    {
        return curl_setopt($this->curl, $option, $value);
    }

    public function execute()
    {
        return curl_exec($this->curl);
    }

    public function close()
    {
        return curl_close($this->curl);
    }
}
