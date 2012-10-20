<?php
namespace Kort\Webservice;

class RelayHandlerPost extends RelayHandler
{
    public function relayHandler()
    {
        $wsConfig = new DbWebserviceConfig();
        $fullPath = $wsConfig->url.$this->app->request()->getResourceUri();
        
        // TODO post data is sent as payload from Sencha Touch. This transformation should be done in db webservice instead of relay webservice
        $requestBody = $this->app->request()->getBody();  // <- getBody() of http request
        $json_a = json_decode($requestBody, true);
        echo $this->relayRequest($this->app->request()->getMethod(), $fullPath, $json_a);
    }

}
