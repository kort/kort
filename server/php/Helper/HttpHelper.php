<?php
/**
 * kort - Helper\HttpHelper class
 */
namespace Helper;

/**
 * The HttpHelper class is a helper class for common http requests.
 *
 * Currently GET, POST and PUT are supported.
 */
class HttpHelper
{
    /**
     * A wrapper object around the curl functions.
     *
     * @var CurlHelper
     */
    protected $curl;

    /**
     * Creates a new instance of HttpHelper.
     */
    public function __construct()
    {
        $this->curl = new CurlHelper();
    }

    /**
     * Makes a GET request to the given url with the given data.
     *
     * @param string       $url  The url of the request.
     * @param array|string $data The data to send along with this request.
     *
     * @return string Returns the servers response
     */
    public function get($url, $data = null)
    {
        return $this->request("GET", $url, $data);
    }

    /**
     * Makes a PUT request to the given url with the given data.
     *
     * @param string       $url  The url of the request.
     * @param array|string $data The data to send along with this request.
     *
     * @return string Returns the servers response
     */
    public function put($url, $data = null)
    {
        return $this->request("PUT", $url, $data);
    }

    /**
     * Makes a POST request to the given url with the given data.
     *
     * @param string       $url  The url of the request.
     * @param array|string $data The data to send along with this request.
     *
     * @return string Returns the servers response
     */
    public function post($url, $data = null)
    {
        return $this->request("POST", $url, $data);
    }

    /**
     * Sets a curl option.
     *
     * @param integer $option A curl option.
     * @param mixed   $value  The corresponding value.
     *
     * @return bool true on success or false on failure.
     */
    public function setOption($option, $value)
    {
        return $this->curl->setOption($option, $value);
    }

    /**
     * Make a request to the database webservice.
     *
     * @param string       $method The HTTP method to use [POST, PUT, GET].
     * @param string       $url    The URL to send the request to.
     * @param array|string $data   The data to send along with the request.
     *
     * @return mixed the answer from the database webservice
     */
    protected function request($method, $url, $data = null)
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
