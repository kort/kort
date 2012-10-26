<?php
namespace Kort;

use Helper\StringHelper;

class ClassLoader {
    public static function autoload($className)
    {
        $classPath = __DIR__."/".str_replace("\\", "/",$className).".php";
        if (\file_exists($classPath)) {
            require_once($classPath);
        }
    }

    public static function autoloadLibrary($className)
    {
        //SimpleTest
        require_once(dirname(__FILE__) . '/../../lib/simpletest/reporter.php');
        require_once(dirname(__FILE__) . '/../../lib/simpletest/test_case.php');
        require_once(dirname(__FILE__) . '/../../lib/simpletest/unit_tester.php');

        //Slim
        require_once(dirname(__FILE__) . '/../../lib/Slim-2.1.0/Slim/Slim.php');
    }

    public static function importClass($path, $className)
    {
        if (StringHelper::endsWith($path, ".php")) {
            require_once($path);
        } else {
                require_once($path."/".$className);
        }
    }

    public static function registerAutoLoader() {
        spl_autoload_register(__CLASS__ . "::autoloadLibrary");
        spl_autoload_register(__CLASS__ . "::autoload");
    }
}
