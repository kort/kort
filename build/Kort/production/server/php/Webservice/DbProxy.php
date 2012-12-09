<?php
namespace Webservice;

use Helper\CurlHelper;

class DbProxy
{
    protected $wsConfig;
    protected $table;
    protected $fields = array();
    protected $where;
    protected $orderBy;
    protected $limit;
    protected $curl;
    protected $returnFields;

    public function __construct($table, $fields)
    {
        $this->wsConfig = new DbWebserviceConfig();
        $this->table = $table;
        $this->fields = $fields;
        $this->curl = new CurlHelper();
    }

    public function isTransaction()
    {
        return false;
    }

    public function getDbWebserviceConfig()
    {
        return $this->wsConfig;
    }

    //only used for unit testing
    public function setCurl($curl)
    {
        $this->curl = $curl;
    }

    public function setFields($fields)
    {
         $this->fields = $fields;
    }

    public function setReturnFields($returnFields)
    {
        $this->returnFields = $returnFields;
    }

    public function setWhere($where)
    {
        $this->where = $where;
    }

    public function setOrderBy($orderBy)
    {
        $this->orderBy = $orderBy;
    }

    public function setLimit($limit)
    {
         $this->limit = $limit;
    }

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
