<?php
/**
 * kort - Webservice\DbProxy class
 */
namespace Webservice;

use Helper\CurlHelper;

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
     * Curl wrapper object.
     *
     * @var CurlHelper
     */
    protected $curl;

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
        $this->curl = new CurlHelper();
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
     * Setter for curl wrapper (only used by unit tests).
     *
     * @param CurlHelper $curl Curl wrapper object.
     *
     * @return void
     */
    public function setCurl(CurlHelper $curl)
    {
        $this->curl = $curl;
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
        return $this->request("GET", $this->wsConfig->getUrl() . $path);
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
        return $this->request("POST", $this->wsConfig->getUrl() . $path, $data);
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
        return $this->request("PUT", $this->wsConfig->getUrl() . $path, $data);
    }

    /**
     * Make a request to the database webservice.
     *
     * @param string $method The HTTP method to use [POST, PUT, GET].
     * @param string $url    The URL to send the request to.
     * @param array  $data   The data to send along with the request.
     *
     * @return mixed the answer from the database webservice
     */
    protected function request($method, $url, array $data)
    {
        switch ($method)
        {
            case "POST":
                $this->curl->setOption(CURLOPT_POST, 1);

                if ($data) {
                    $this->curl->setOption(CURLOPT_POSTFIELDS, $data);
                }
                break;
            case "PUT":
                $this->curl->setOption(CURLOPT_CUSTOMREQUEST, "PUT");

                if ($data) {
                    $this->curl->setOption(CURLOPT_POSTFIELDS, http_build_query($data));
                }
                break;
            default:
                if ($data) {
                    $url = sprintf("%s?%s", $url, http_build_query($data));
                }
        }

        $this->curl->setOption(CURLOPT_URL, $url);
        $this->curl->setOption(CURLOPT_RETURNTRANSFER, 1);

        $result = $this->curl->execute();
        $this->curl->close();

        return $result;
    }
}
