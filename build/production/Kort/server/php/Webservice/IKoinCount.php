<?php
/**
 * kort - Webservice\IKoinCount interface
 */

namespace Webservice;

/**
 * This interface describes common methods for koin count manipulating webservice handlers.
 */
interface IKoinCount
{
    /**
     * Returns a query to find the koinCount.
     *
     * @param array $data The inserted data.
     *
     * @return string query to find the koinCount for votes
     */
    public function getKoinCountQuery(array $data);
}
