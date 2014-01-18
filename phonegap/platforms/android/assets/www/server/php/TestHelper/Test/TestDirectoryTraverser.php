<?php
namespace TestHelper\Test;

use TestHelper\AbstractKortUnitTestCase;
use TestHelper\DirectoryTraverser;

class TestDirectoryTraverser extends AbstractKortUnitTestCase
{
    public function __construct()
    {
        parent::__construct("kort - TestDirectoryTraverser");
    }

    public function testConstruct()
    {
        $callable = function () {
        };
        $trav = new DirectoryTraverser($callable);
        $this->assertIsA($trav, "\\TestHelper\\DirectoryTraverser");
    }

    public function testConstructWithoutBlock()
    {
        try {
            $trav = new DirectoryTraverser("");
            $this->fail("Constructor should throw an exception when called without a callable function (block)");
        } catch (\Exception $e) {
            $this->pass("Exception reiceived as expected");
        }
    }
}
