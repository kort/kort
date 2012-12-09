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
    /** @var DbWebserviceConfig database webservice configuration */
    protected $wsConfig;
    /** @var string database table */
    protected $table;
    /** @var array database table fields */
    protected $fields = array();
    /** @var string where clause (condition) */
    protected $where;
    /** @var string order by clause (sorting) */
    protected $orderBy;
    /** @var int amount of records to return */
    protected $limit;
    /** @var array fields to return */
    protected $returnFields;
    /** @var CurlHelper curl wrapper object */
    protected $curl;

    /**
     * Create a new DbProxy object for a request
     * @param string $table database table
     * @param array $fields database table fields
     */
    public function __construct($table, $fields)
    {
        $this->wsConfig = new DbWebserviceConfig();
        $this->table = $table;
        $this->fields = $fields;
        $this->curl = new CurlHelper();
    }

    /**
     * Indicates wheter the requests runs in a transaction or not
     * @return bool true if the request runs in a transation, false otherwise
     */
    public function isTransaction()
    {
        return false;
    }

    /**
     * Getter for $wsConfig
     * @return DbWebserviceConfig the database webservice configuration
     */
    public function getDbWebserviceConfig()
    {
        return $this->wsConfig;
    }

    /**
     * Setter for curl wrapper (only used by unit tests)
     * @param CurlHelper $curl a curl wrapper object
     */
    public function setCurl($curl)
    {
        $this->curl = $curl;
    }

    /**
     * Setter for $fields
     * @param array $fields database table fields
     */
    public function setFields($fields)
    {
         $this->fields = $fields;
    }

    /**
     * Setter for $returnFields
     * @param array $returnFields the database table fields to return from the request
     */
    public function setReturnFields($returnFields)
    {
        $this->returnFields = $returnFields;
    }

    /**
     * Setter for $where
     * @param string $where the condition of the request
     */
    public function setWhere($where)
    {
        $this->where = $where;
    }

    /**
     * Setter for $orderBy
     * @param string $orderBy the sorting of the result
     */
    public function setOrderBy($orderBy)
    {
        $this->orderBy = $orderBy;
    }

    /**
     * Setter for $limit
     * @param int $limit amount of records to return
     */
    public function setLimit($limit)
    {
         $this->limit = $limit;
    }

    /**
     * Make a select request
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
     * Make an insert request
     * @param array $data the data to insert
     * @return mixed the result from the database (defined by $returnFields)
     */
    public function insert($data)
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
     * Make an update request
     * @param array $data the data to update
     * @return mixed the result from the database (defined by $returnFields)
     */
    public function update($data)
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
     * Make a request to the database webservice
     * @param string $method the HTTP method to use [POST, PUT, GET]
     * @param string $url the URL to send the request to
     * @param array $data the data to send along with the request
     * @return mixed the answer from the database webservice
     */
    protected function request($method, $url, $data = false)
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
