<?php
/**
 * kort - Webservice\User\UserBadgesHandler class
 */
namespace Webservice\User;

use Webservice\DbProxyHandler;

/**
 * The UserBadgesHandler class handles requests to the user/badges webservice.
 */
class UserBadgesHandler extends DbProxyHandler
{
    /**
     * Returns the table used by this handler.
     *
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.user_badges';
    }

    /**
     * Returns the table fields used by this handler.
     *
     * @return array the table fields used by this handler.
     */
    protected function getFields()
    {
        return array(
            'id',
            'name',
            'title',
            'description',
            'color',
            'sorting'
        );
    }

    /**
     * Returns all badges and marks the won badges for the user.
     *
     * @param integer $user_id The users id.
     *
     * @return string|bool the JSON-encoded badges is successful, false otherwise
     */
    public function getUserBadges($user_id)
    {
        $fields = $this->getFields();

        $wonFieldSql  = "exists(select 1 from kort.user_badge ub ";
        $wonFieldSql .= "where ub.user_id = " . $user_id . " and ub.badge_id = id) as won";
        $fields[] = urlencode($wonFieldSql);

        $createDateFieldSql  = "(select to_char(create_date, 'DD.MM.YYYY HH24:MI') from kort.user_badge ub ";
        $createDateFieldSql .= "where ub.user_id = " . $user_id . " and ub.badge_id = id) as create_date";
        $fields[] = urlencode($createDateFieldSql);

        $this->getDbProxy()->setFields($fields);

        $badgeData = $this->getDbProxy()->select();
        if (!$badgeData) {
            return false;
        }

        $userBadges = json_decode($badgeData, true);
        $userBadges = array_map(array($this, "convertBoolean"), $userBadges);
        $userBadges = array_map(array($this, "translateBadge"), $userBadges);
        return json_encode($userBadges);
    }

    /**
     * Converts the string values from the database to "real" boolean values.
     *
     * @param array $badge The badge data.
     *
     * @return array the $badge data with fixed boolean values
     */
    public function convertBoolean(array $badge)
    {
        $badge['won'] = ($badge['won'] == 't') ? true : false;
        return $badge;
    }

    /**
     * Translate all texts of a badge.
     *
     * @param array $badge The badge to translate.
     *
     * @return array the translated badge
     */
    public function translateBadge(array $badge)
    {
        $badge['title'] = $this->translate($badge['title']);
        $badge['description'] = $this->translate($badge['description']);

        return $badge;
    }
}
