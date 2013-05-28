<?php
/**
 * kort - Webservice\Bug\BugHandler class
 */
namespace Webservice\Promotion;

use Webservice\DbProxyHandler;
use Helper\PostGisSqlHelper;
use Webservice\TransactionDbProxy;

/**
 * The PromotionHandler class is used to handle request to the promotion webservices.
 */
class PromotionHandler extends DbProxyHandler
{
    /**
     * Initialized the BugHandler object.
     *
     * @param TransactionDbProxy $dbProxy The database proxy object.
     */
    public function __construct(TransactionDbProxy $dbProxy = null)
    {
        parent::__construct();
        if (empty($dbProxy)) {
            $this->setDbProxy(new TransactionDbProxy());
        } else {
            $this->setDbProxy($dbProxy);
        }
    }

    /**
     * Returns the table used by this handler.
     *
     * @return string the table name used by this handler.
     */
    protected function getTable()
    {
        return 'kort.promotion';
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
            'title',
            'to_char(startdate, \'DD.MM.YYYY\')AS startdate',
            'to_char(enddate, \'DD.MM.YYYY\')AS enddate',
        );
    }

    /**
     * Returns all promotions.
     *
     * @return string JSON-formatted promotions
     */
    public function getAllPromotions()
    {
        $sql = "select " . implode($this->getFields(), ',');
        $sql .= " from " . $this->getTable();

        $params = array();
        $params['sql'] = $sql;
        $params['type'] = "SQL";

        $position = $this->getDbProxy()->addToTransaction($params);
        $result = json_decode($this->getDbProxy()->sendTransaction(), true);
        $promotionList = $result[$position - 1];
        return json_encode($promotionList);
    }
}
