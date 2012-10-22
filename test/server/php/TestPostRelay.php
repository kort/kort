<?php
require_once(dirname(__FILE__) . '/../GFTPrototypeUnitTestCase.php');
require_once(dirname(__FILE__) . '/../../classes/PostRelay.class.php');

class TestPostRelay extends GFTPrototypeUnitTestCase 
{
	protected $localUrl;
	protected $remoteUrl;
	protected $dataString;
	protected $dataArray = array();
	
	function __construct() 
	{
		parent::__construct("GFTPrototype - TestPostRelay");
	}
	
	function setUp() {
		parent::setUp();
		$this->localUrl = "http://localhost".dirname($_SERVER['PHP_SELF'])."/test.html";
		$this->remoteUrl = "http://www.snee.com/xml/crud/posttest.cgi";
		$this->dataString = "fname=testname";
		$this->dataArray = array(
			"fname"	 => "testname",
			"lname" => "testlastname"
		);
	}
	
	function testConstructWithData() {
		$relay = new PostRelay("", $this->dataString);
        $this->assertIsA($relay, "PostRelay");
		$this->assertEqual($relay->getData(),$this->dataString);
    }
	
	function testConstructWithDataArray() {
		$relay = new PostRelay("", $this->dataArray);
        $this->assertIsA($relay, "PostRelay");
		$this->assertEqual($relay->getData(),$this->dataArray);
    }
	
	function testConstructWithoutData() {
		$relay = new PostRelay("");
        $this->assertIsA($relay, "PostRelay");
		$this->assertIdentical($relay->getData(), $_POST);
		
    }
	
	function testGetUrlWithoutData() {
		$relay = new PostRelay($this->localUrl, "");
        $this->assertEqual($relay->getUrl(), $this->localUrl);
    }
	
	function testGetUrlWithData() {
		$relay = new PostRelay($this->localUrl, $this->dataString);
        $this->assertEqual($relay->getUrl(), $this->localUrl."?".$this->dataString);
    }
	
	function testRelayLocal() {
		$relay = new PostRelay($this->localUrl, $this->dataString);
		$response = $relay->relay();
		
		$this->assertPattern("/Test-Div content/", $response);
    }
	
	function testRelayRemote() {
		$relay = new PostRelay($this->remoteUrl, $this->dataString);
		$response = $relay->relay();
		
		$this->assertPattern("/First name: \"testname\"/", $response);
    }
	
	function testRelayRemoteException() {
		$relay = new PostRelay("adsasd", "");
		try {
			$response = $relay->relay();
			$this->fail("Should not reach this line, RemoteException should be thrown");
		} catch (Exception $e) {
			$this->assertIsA($e, "RemoteException");
			$this->assertPattern("/Error from adsasd: cURL Errornumber: 6 cURL Error: (Could not|Couldn't) resolve host:? '?adsasd'?/", $e->getMessage());
		}
		
    }
}
?>