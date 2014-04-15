<?php
/**
 * kort - the ClassLoader class
 */

namespace Kort;

use Helper\StringHelper;

/**
 * The ClassLoader class is used throughout the application to locate classes.
 *
 * Therefore this classloader is registered and used at runtime whenever a
 * unknown class is used for the first time. Initially some libraries are loaded
 * to be available immediatly. For all further classes the Namespace hierarchy
 * is assumed to reflect in the folder structure, the classes are loaded accordingly.
 *
 * This means that:
 * <ul>
 *   <li>The namespace of a class must match the path of the file</li>
 *   <li>Filenames and class names <b>must</b> match</li>
 * </ul>
 */
class ClassLoader
{
    /**
     * This function is called whenever a yet unknown class is requested.
     *
     * If the class is found it get loaded immediately.
     *
     * @param string $className Name of the requested class.
     *
     * @return void
     */
    public static function autoload($className)
    {
        $classPath = __DIR__."/".str_replace("\\", "/", $className).".php";
        if (\file_exists($classPath)) {
            require_once($classPath);
        }
    }

    /**
     * Loads common libraries at startup.
     *
     * @return void
     */
    protected static function loadLibraries()
    {
        //Slim
        require_once(dirname(__FILE__) . '/../../lib/Slim-2.1.0/Slim/Slim.php');

        //Load autoloader of Composer
        $composerAutoloader = dirname(__FILE__) . '/../../vendor/autoload.php';
        if (file_exists($composerAutoloader)) {
            require_once($composerAutoloader);
        }
    }

    /**
     * Loads test libraries.
     *
     * @return void
     */
    protected static function loadTestLibraries()
    {
        //SimpleTest
        require_once(dirname(__FILE__) . '/../../lib/simpletest/reporter.php');
        require_once(dirname(__FILE__) . '/../../lib/simpletest/test_case.php');
        require_once(dirname(__FILE__) . '/../../lib/simpletest/unit_tester.php');
    }

    /**
     * Imports a class by name or path.
     *
     * The full path is either provided in the $path argument or
     * constructued using the $path and $className.
     *
     * @param string $path      The path to the class.
     * @param string $className The name of the class.
     *
     * @return void
     */
    public static function importClass($path, $className = null)
    {
        if (StringHelper::endsWith($path, ".php")) {
            require_once($path);
        } else {
                require_once($path . "/" . $className . ".php");
        }
    }

    /**
     * This method must be called by a client in order to use the ClassLoader.
     *
     * @param string $mode Indicates the environment of the ClassLoader.
     *
     * @return void
     */
    public static function registerAutoLoader($mode = "production")
    {
        self::loadLibraries();
        spl_autoload_register(__CLASS__ . "::autoload");

        if ($mode === "test") {
            self::loadTestLibraries();
        }
    }
}
