<?php
namespace Model;

class Reward
{
    protected $badges = array();
    protected $koinCount = 0;

    public function __construct($koinCountTotal, $koinCountNew = 0, $badges = array())
    {
        $this->koinCountTotal = $koinCountTotal;
        $this->koinCountNew = $koinCountNew;
        $this->badges = $badges;
    }

    public function toJson()
    {
        $response = array();
        $response["badges"] = array_map(Badge::getValueFn(), $this->getBadges());
        $response["koin_count_new"] = $this->getKoinCountNew();
        $response["koin_count_total"] = $this->getKoinCountTotal();

        return json_encode($response);
    }

    protected function getBadges()
    {
        return $this->badges;
    }

    protected function getKoinCountNew()
    {
        return $this->koinCountNew;
    }

    protected function getKoinCountTotal()
    {
        return $this->koinCountTotal;
    }
}
