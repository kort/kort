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
        $originalPicUrl = "http://www.gravatar.com/avatar/28183e09aff101bc1f80c7e7a1917d83?s=200&d=mm&r=r";
        $avatarUrl = GravatarHelper::getGravatarUrl("oderbolz@gmail.com");
        $pic = base64_encode($this->http->get($avatarUrl));

        $this->assertNotNull($avatarUrl);
        $this->assertNotNull($pic);
        $this->assertEqual($originalPicUrl, $avatarUrl, "URLs should match");
    }

    public function testGetGravatarUrlNotExistingEmail()
    {
        $picUrl = "http://www.gravatar.com/avatar/b4b5e684119038eca5b9ccf84d594d03?s=200&d=mm&r=r";
        $avatarUrl = GravatarHelper::getGravatarUrl("non-existing@email.address");
        $pic = base64_encode($this->http->get($avatarUrl));

        $this->assertNotNull($avatarUrl);
        $this->assertNotNull($pic);
        $this->assertEqual($picUrl, $avatarUrl, "URLs should match");
    }
}
