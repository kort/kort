<?php
/**
 * kort - Webservice\Fix\FixGetHandler class
 */
namespace Webservice\Fix;

use Webservice\DbProxyHandler;
use Webservice\Bug\BugHandler;

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
            'answer',
            'description',
            'complete',
            'valid',
            'required_votes',
            'upratings',
            'downratings',
            'osm_id',
            'osm_type',
            'schema',
            'error_id'
        );
    }

    /**
     * Returns the headers of the database fields.
     *
     * @return an array of headers
     */
    public function getHeaders()
    {
        return array(
            'fix_id'                => 'Fix ID',
            'user_id'               => 'User ID',
            'username'              => 'Benutzername',
            'formatted_create_date' => 'Erstellungsdatum',
            'latitude'              => 'Latitude',
            'longitude'             => 'Longitude',
            'question'              => 'Auftrag',
            'answer'                => 'L&ouml;sungsvorschlag',
            'description'           => 'Beschreibung des L&ouml;sungsvorschlags',
            'complete'              => 'Abgeschlossen?',
            'valid'                 => 'G&uuml;ltig?',
            'required_votes'        => 'Ben&ouml;tigte Pr&uuml;fungen',
            'upratings'             => 'Positive &Uuml;berpr&uuml;fungen',
            'downratings'           => 'Negative &Uuml;berpr&uuml;fungen',
            'votes'                 => 'Pr&uuml;fungen',
            'osm_id'                => 'OSM object ID',
            'osm_link'              => 'OSM-Objekt',
            'osm_type'              => 'OSM type',
            'edit'                  => 'Bearbeiten'
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
        return $this->getFixes("complete and valid");
    }

     /**
     * Returns all fixes for the given where clause.
     *
     * @return string|bool a JSON-encoded array of fixes if successfull, false otherwise
     */
    protected function getFixes($where)
    {
        $this->getDbProxy()->setWhere($where);
        $this->getDbProxy()->setOrderBy("create_date");
        $fixData = json_decode($this->getDbProxy()->select(), true);
        if (!$fixData) {
            return false;
        }

        $fixData = array_map(array($this, "reduceData"), $fixData);

        return json_encode($fixData);
    }

    protected function reduceData($fix)
    {
        $fix = $this->votes($fix);
        $fix = $this->osmLink($fix);
        $fix = $this->editInPotlatch2($fix);

        $fix['answer'] = htmlentities($fix['answer']);

        unset($fix['osm_id']);
        unset($fix['required_votes']);
        unset($fix['upratings']);
        unset($fix['downratings']);
        unset($fix['osm_type']);
        unset($fix['fix_id']);
        unset($fix['complete']);
        unset($fix['valid']);
        unset($fix['latitude']);
        unset($fix['longitude']);
        unset($fix['user_id']);
        unset($fix['schema']);
        unset($fix['error_id']);
        return $fix;
    }

    protected function booleanToText($value)
    {
        if ($value == "t") {
            return "Yes";
        } else if ($value == "f") {
            return "No";
        } else {
            return "";
        }
    }

    protected function osmLink($fix)
    {
        $osmUrl = "http://www.openstreetmap.org/browse/" . $fix['osm_type'] . "/" . $fix['osm_id'];
        $fix['osm_link'] = "<a href=\"" . $osmUrl . "\">" . $fix['osm_id'] . "</a>";
        return $fix;
    }

    protected function votes($fix)
    {
        $fix['votes'] = "";
        if ($fix['upratings'] > 0) {
             $fix['votes'] = $fix['votes'] . "+" . $fix['upratings'] . "<img class=\"thumb\" src=\"../resources/images/validation/thumbs-up.png\" />";
        }
        if ($fix['downratings'] > 0) {
             $fix['votes'] = $fix['votes'] . "-" . $fix['downratings'] . "<img class=\"thumb\" src=\"../resources/images/validation/thumbs-down.png\" />";
        }
        return $fix;
    }

    protected function editInPotlatch2($fix)
    {
        $fix['edit'] = "<a href=\"http://www.openstreetmap.org/edit?editor=potlatch2&lat=" . $fix['latitude'] . "&lon=" . $fix['longitude'] . "&zoom=18\"><img src=\"edit.png\" alt=\"Edit in Potlatch2\" title=\"Edit in Potlatch2\" /></a>";
        return $fix;
    }
}
