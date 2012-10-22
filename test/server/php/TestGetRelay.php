<?php
require_once(dirname(__FILE__) . '/../GFTPrototypeUnitTestCase.php');
require_once(dirname(__FILE__) . '/../../classes/GetRelay.class.php');

class TestGetRelay extends GFTPrototypeUnitTestCase 
{
	protected $localUrl;
	protected $remoteUrl;
	protected $dataString;
	protected $dataArray = array();
	
	function __construct() 
	{
		parent::__construct("GFTPrototype - TestGetRelay");
	}
	
	function setUp() {
		parent::setUp();
		$this->localUrl = "http://localhost".dirname($_SERVER['PHP_SELF'])."/test.html";
		$this->remoteUrl = "http://google.com";
		$this->dataString = "test=testdata";
		$this->dataArray = array(
			"myreq"		 => "test",
			"myotherreq" => "somedata"
		);
	}
	
    function testConstructWithData() {
		$relay = new GetRelay("", $this->dataString);
        $this->assertIsA($relay, "GetRelay");
		$this->assertEqual($relay->getData(),$this->dataString);
    }
	
	function testConstructWithDataArray() {
		$relay = new GetRelay("", $this->dataArray);
        $this->assertIsA($relay, "GetRelay");
		$this->assertEqual($relay->getData(),$this->dataArray);
    }
	
	function testConstructWithoutData() {
		$relay = new GetRelay("");
        $this->assertIsA($relay, "GetRelay");
		$this->assertIdentical($relay->getData(), $_GET);
    }
	
	function testGetUrlWithoutData() {
		$relay = new GetRelay($this->localUrl, "");
        $this->assertEqual($relay->getUrl(), $this->localUrl);
    }
	
	function testGetUrlWithData() {
		$relay = new GetRelay($this->localUrl, $this->dataString);
        $this->assertEqual($relay->getUrl(), $this->localUrl."?".$this->dataString);
    }
	
	function testRelayLocal() {
		$relay = new GetRelay($this->localUrl, $this->dataString);
		$response = $relay->relay();
		
		$this->assertPattern("/Test-Div content/", $response);
    }
	
	function testRelayRemote() {
		$relay = new GetRelay($this->remoteUrl, $this->dataString);
		$response = $relay->relay();
		
		$this->assertNotNull($response);
    }
	
	function testRelayRemoteException() {
		$relay = new GetRelay("adsasd", "");
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
