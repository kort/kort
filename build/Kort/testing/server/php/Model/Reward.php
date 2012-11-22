<?php
namespace Model;

class Reward
{
    protected $badges = array();
    protected $koins = 0;

    public function __construct($koins = 0, $badges = array())
    {
        $this->badges = $badges;
        $this->koins = $koins;
    }

    public function toJson()
    {
        $response = array();
        $response["badges"] = array_map(Badge::getValueFn(), $this->getBadges());
        $response["koins"] = $this->getKoins();

        return json_encode($response);
    }

    protected function getBadges()
    {
        return $this->badges;
    }

    protected function getKoins()
    {
        return $this->koins;
    }
}
