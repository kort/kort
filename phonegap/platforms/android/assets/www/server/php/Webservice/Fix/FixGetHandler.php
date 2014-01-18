<?php
/**
 * kort - Webservice\Fix\FixGetHandler class
 */
namespace Webservice\Fix;

use Webservice\DbProxyHandler;

/**
 * The FixGetHandler class handles all GET requests to the fix webservice.
 */
class FixGetHandler extends DbProxyHandler
{
    /**
     * Returns the database table to be used with this Handler.
     *
     * @return the database table as a string
     */
    protected function getTable()
    {
        return 'kort.all_fixes';
    }

    /**
     * Returns the database fields to be used with this Handler.
     *
     * @return an array of database fields
     */
    protected function getFields()
    {
        return array(
            'fix_id',
            'user_id',
            'username',
            'formatted_create_date',
            'latitude',
            'longitude',
            'error_type',
            'error_type_description',
            'answer',
            'falsepositive',
            'description',
            'complete',
            'valid',
            'required_votes',
            'upratings',
            'downratings',
            'osm_id',
            'osm_type',
            'osm_tag',
            'schema',
            'error_id'
        );
    }

    /**
     * Returns all pending fixes.
     *
     * @return string|bool a JSON-encoded array of fixes if successfull, false otherwise
     */
    public function getPendingFixes()
    {
        return $this->getFixes("not complete");
    }

    /**
     * Returns all completed and valid fixes.
     *
     * @return string|bool a JSON-encoded array of fixes if successfull, false otherwise
     */
    public function getCompletedValidFixes()
    {
        return $this->getFixes("complete and valid and not in_osm");
    }

    /**
     * Returns all fixes for the given where clause.
     *
     * @param string $where The WHERE clause to filter the fixes.
     *
     * @return string|bool a JSON-encoded array of fixes if successfull, false otherwise
     */
    protected function getFixes($where)
    {
        $this->getDbProxy()->setWhere($where);
        $this->getDbProxy()->setOrderBy("(required_votes - upratings + downratings), create_date");
        $fixData = json_decode($this->getDbProxy()->select(), true);
        if (!$fixData) {
            return false;
        }

        return json_encode($fixData);
    }
}
