<?php
namespace Webservice;

class DbProxy
{
    protected $wsConfig;
    protected $table;
    protected $fields = array();
    protected $where;
    protected $orderBy;
    protected $limit;

    public function __construct($table, $fields)
    {
        $this->wsConfig = new DbWebserviceConfig();
        $this->table = $table;
        $this->fields = $fields;
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

    public function getFromDb()
    {
        $path  = "/" . $this->table;
        $path .= (count($this->fields) > 0) ? "/" . implode(",", $this->fields) : "";
        $path .= "?";

        $path .= ($this->where) ? "where=" . urlencode($this->where) . "&" : "";
        $path .= ($this->orderBy) ? "orderby=" . urlencode($this->orderBy) . "&" : "";
        $path .= ($this->limit) ? "limit=" . $this->limit . "&" : "";

        return $this->request("GET", $this->wsConfig->url . $path);
    }

    public function postToDb($data)
    {
        $path  = "/" . $this->table;
        $path .= "/" . implode(",", $this->fields);

        return $this->request("POST", $this->wsConfig->url . $path, $data);
    }

    private function request($method, $url, $data = false)
    {
        $curl = curl_init();

        switch ($method)
        {
            case "POST":
                curl_setopt($curl, CURLOPT_POST, 1);

                if ($data) {
                    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
                }
                break;
            case "PUT":
                curl_setopt($curl, CURLOPT_PUT, 1);
                break;
            default:
                if ($data) {
                    $url = sprintf("%s?%s", $url, http_build_query($data));
                }
        }

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

        $result = curl_exec($curl);
        curl_close($curl);

        return $result;
    }
}
