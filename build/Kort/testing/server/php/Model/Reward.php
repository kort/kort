<?php
namespace Model;

class Reward
{
    protected $badges = array();
    protected $koinCount = 0;

    public function __construct($koinCount = 0, $badges = array())
    {
        $this->badges = $badges;
        $this->koinCount = $koinCount;
    }

    public function toJson()
    {
        $response = array();
        $response["badges"] = array_map(Badge::getValueFn(), $this->getBadges());
        $response["koinCount"] = $this->getKoinCount();

        return json_encode($response);
    }

    protected function getBadges()
    {
        return $this->badges;
    }

    protected function getKoinCount()
    {
        return $this->koinCount;
    }
}
