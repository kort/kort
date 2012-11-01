<?php
namespace Kort;

use Helper\StringHelper;

class ClassLoader
{
    public static function autoload($className)
    {
        $classPath = __DIR__."/".str_replace("\\", "/", $className).".php";
        if (\file_exists($classPath)) {
            require_once($classPath);
        }
    }

    protected static function loadLibraries()
    {
        //Slim
        require_once(dirname(__FILE__) . '/../../lib/Slim-2.1.0/Slim/Slim.php');
    }

    protected static function loadTestLibraries()
    {
        //SimpleTest
        require_once(dirname(__FILE__) . '/../../lib/simpletest/reporter.php');
        require_once(dirname(__FILE__) . '/../../lib/simpletest/test_case.php');
        require_once(dirname(__FILE__) . '/../../lib/simpletest/unit_tester.php');

        //Mockery
        require_once 'Mockery/Loader.php';
        require_once 'Hamcrest/Hamcrest.php';
        $loader = new \Mockery\Loader;
        $loader->register();
    }

    public static function importClass($path, $className)
    {
        if (StringHelper::endsWith($path, ".php")) {
            require_once($path);
        } else {
                require_once($path."/".$className);
        }
    }

    public static function registerAutoLoader($mode = "production")
    {
        self::loadLibraries();
        spl_autoload_register(__CLASS__ . "::autoload");

        if ($mode === "test") {
            self::loadTestLibraries();
        }
    }
}
