<?php
namespace Webservice;

class RelayHandlerGet extends RelayHandler
{
    public function relayHandler()
    {
        $wsConfig = new DbWebserviceConfig();
        $fullPath = $wsConfig->url.$this->app->request()->getResourceUri();
        if (!empty($_SERVER['QUERY_STRING'])) {
            $fullPath .= "?".$_SERVER['QUERY_STRING'];
        }
        echo $this->relayRequest($this->app->request()->getMethod(), $fullPath);
    }
}
