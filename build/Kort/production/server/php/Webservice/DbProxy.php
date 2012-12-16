<?php
/**
 * kort - Webservice\DbProxy class
 */
namespace Webservice;

use Helper\HttpHelper;

/**
 * The DbProxy class is used wrap database request in REST calls to the datbase webservice.
 */
class DbProxy
{
    /**
     * Database webservice configuration.
     *
     * @var DbWebserviceConfig
     */
    protected $wsConfig;

    /**
     * Database table name.
     *
     * @var string
     */
    protected $table;

    /**
     * Database table field names.
     *
     * @var array
     */
    protected $fields = array();

    /**
     * WHERE clause (condition).
     *
     * @var string
     */
    protected $where;

    /**
     * ORDER BY clause (sorting).
     *
     * @var string
     */
    protected $orderBy;

    /**
     * Amount of records to return.
     *
     * @var integer
     */
    protected $limit;

    /**
     * Fields to return.
     *
     * @var array
     */
    protected $returnFields;

    /**
     * Http helper object to make requests.
     *
     * @var HttpHelper
     */
    protected $http;

    /**
     * Create a new DbProxy object for a request.
     *
     * @param string $table  Database table.
     * @param array  $fields Database table fields.
     */
    public function __construct($table, array $fields)
    {
        $this->wsConfig = new DbWebserviceConfig();
        $this->table = $table;
        $this->fields = $fields;
        $this->http = new HttpHelper();
    }

    /**
     * Indicates wheter the requests runs in a transaction or not.
     *
     * @return bool true if the request runs in a transation, false otherwise
     */
    public function isTransaction()
    {
        return false;
    }

    /**
     * Getter for $wsConfig.
     *
     * @return DbWebserviceConfig the database webservice configuration
     */
    public function getDbWebserviceConfig()
    {
        return $this->wsConfig;
    }

    /**
     * Setter for http wrapper (only used by unit tests).
     *
     * @param HttpHelper $http HTTP wrapper object.
     *
     * @return void
     */
    public function setHttp(HttpHelper $http)
    {
        $this->http = $http;
    }

    /**
     * Setter for $fields.
     *
     * @param array $fields Database table fields.
     *
     * @return void
     */
    public function setFields(array $fields)
    {
         $this->fields = $fields;
    }

    /**
     * Setter for $returnFields.
     *
     * @param array $returnFields The database table fields to return from the request.
     *
     * @return void
     */
    public function setReturnFields(array $returnFields)
    {
        $this->returnFields = $returnFields;
    }

    /**
     * Setter for $where.
     *
     * @param string $where The condition of the request.
     *
     * @return void
     */
    public function setWhere($where)
    {
        $this->where = $where;
    }

    /**
     * Setter for $orderBy.
     *
     * @param string $orderBy The sorting of the result.
     *
     * @return void
     */
    public function setOrderBy($orderBy)
    {
        $this->orderBy = $orderBy;
    }

    /**
     * Setter for $limit.
     *
     * @param integer $limit Amount of records to return.
     *
     * @return void
     */
    public function setLimit($limit)
    {
         $this->limit = $limit;
    }

    /**
     * Make a select request.
     *
     * @return mixed the result from the database
     */
    public function select()
    {
        $path  = "/" . $this->table;
        $path .= (count($this->fields) > 0) ? "/" . implode(",", $this->fields) : "";
        $path .= "?";

        if ($this->where) {
            $path .= "where=" . urlencode($this->where) . "&";
        }
        if ($this->orderBy) {
            $path .= "orderby=" . urlencode($this->orderBy) . "&";
        }
        if ($this->limit) {
            $path .= "limit=" . $this->limit . "&";
        }
        $path .= "key=" . $this->wsConfig->getApiKey();
        return $this->http->get($this->wsConfig->getUrl() . $path);
    }

    /**
     * Make an insert request.
     *
     * @param array $data The data to insert.
     *
     * @return mixed the result from the database (defined by $returnFields)
     */
    public function insert(array $data)
    {
        $path  = "/" . $this->table;
        $path .= "/" . implode(",", $this->fields);

        $data['key'] = $this->wsConfig->getApiKey();
        if ($this->returnFields) {
            $data['return'] = implode(",", $this->returnFields);
        }
        return $this->http->post($this->wsConfig->getUrl() . $path, $data);
    }

    /**
     * Make an update request.
     *
     * @param array $data The data to update.
     *
     * @return mixed the result from the database (defined by $returnFields)
     */
    public function update(array $data)
    {
        $path  = "/" . $this->table;
        $path .= "/" . implode(",", $this->fields);
        $path .= "?";

        if ($this->where) {
            $path .= "where=" . urlencode($this->where) . "&";
        }

        $data['key'] = $this->wsConfig->getApiKey();
        if ($this->returnFields) {
            $data['return'] = implode(",", $this->returnFields);
        }
        return $this->http->put($this->wsConfig->getUrl() . $path, $data);
    }
}
