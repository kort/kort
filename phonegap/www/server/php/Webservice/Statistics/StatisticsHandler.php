<?php
/**
 * kort - Webservice\Statistics\StatisticsHandler class
 */
namespace Webservice\Statistics;

use Webservice\DbProxyHandler;

/**
 * The StatisticsHandler class handles all GET requests to the statistics webservice.
 */
class StatisticsHandler extends DbProxyHandler
{
    /**
     * Returns the database table to be used with this Handler.
     *
     * @return the database table as a string
     */
    protected function getTable()
    {
        return 'kort.statistics';
    }

    /**
     * Returns the database fields to be used with this Handler.
     *
     * @return an array of database fields
     */
    protected function getFields()
    {
        return array("*");
    }

    /**
     * Returns all statistics.
     *
     * @return string all statistics
     */
    public function getStatistics()
    {
        return $this->getDbProxy()->select();
    }
}
