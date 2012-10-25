<?php
namespace Tests;

abstract class KortUnitTestCase extends \UnitTestCase
{
    public static function autoload($className)
    {
        $importPath = static::getClassPaths();
        if (is_array($importPath)) {
            foreach (static::getClassPaths() as $path) {
                self::importClass($path, $className);
            }
        } else {
              self::importClass($importPath, $className);
        }
    }

    private static function importClass($path, $className)
    {
        if (substr($path, - strlen(".php")) === ".php") {
            require_once($path);
        } else {
                require_once($path."/".$className);
        }
    }

    protected static function getClassPaths()
    {
        return "";
    }

    public function __construct($label = "Kort - Test Case")
    {
        parent::__construct($label);
        spl_autoload_register(__NAMESPACE__ . "\\KortUnitTestCase::autoload");
    }

    public function report()
    {
        $test = new \TestSuite($this->getLabel());
        $test->add($this);
        if (\TextReporter::inCli()) {
            exit ($test->run(new  KortCliReporter()) ? 0 : 1);
        }
        $test->run(new KortHTMLReporter());
    }

    public function setUp()
    {
        ob_start();
    }

    public function tearDown()
    {
        ob_end_flush();
    }

    public function getOutput()
    {
        return ob_get_contents();
    }
}
