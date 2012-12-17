<?php
namespace Helper\Test;

use TestHelper\AbstractKortUnitTestCase;
use Helper\GravatarHelper;
use Helper\HttpHelper;

class TestGravatarHelper extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestGravatarHelper");
    }

    public function setUp()
    {
        $this->http = new HttpHelper();
    }

    public function testGetGravatarUrlValid()
    {
        $originalPic = "c09e513365b88655d158e4df59a1fe122bffe3a8";
        $avatarUrl = GravatarHelper::getGravatarUrl("oderbolz@gmail.com");
        $pic = sha1(base64_encode($this->http->get($avatarUrl)));

        $this->assertNotNull($avatarUrl);
        $this->assertEqual($originalPic, $pic, "Pictures should match");
    }

    public function testGetGravatarUrlNotExistingEmail()
    {
        $defaultPic = "716f8c6307c85c35e3636475c5bb168b55a07bdd";
        $avatarUrl = GravatarHelper::getGravatarUrl("non-existing@email.address");
        $pic = sha1(base64_encode($this->http->get($avatarUrl)));

        $this->assertNotNull($avatarUrl);
        $this->assertEqual($defaultPic, $pic, "Pictures should match");
    }
}
