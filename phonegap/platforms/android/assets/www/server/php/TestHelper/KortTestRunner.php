<?php
/**
 * kort - TestHelper\KortTestRunner class
 */
namespace TestHelper;

use Helper\StringHelper;

/**
 * The KortTestRunner class is a helper class to run all tests of the project.
 */
class KortTestRunner
{
    /**
     * Runs the tests of an AbstractKortUnitTestCase.
     *
     * @param string $file The path to a file which contains a sub-class of AbstractKortUnitTestCase.
     *
     * @return void
     * @see    AbstractKortUnitTestCase
     */
    public static function runTestFile($file)
    {
        require_once($file);
        $className = self::findClass($file);
        $refClass = new \ReflectionClass($className);
        $unitTestCase = $refClass->newInstance();
        $unitTestCase->report();
    }

    /**
     * Finds the class name of a file.
     *
     * @param string $filename The filename of PHP file.
     *
     * @return string the class name
     * @throws \Exception If the class could not be found.
     */
    private static function findClass($filename)
    {
        $classFileName = basename($filename, ".php");
        foreach (get_declared_classes() as $declaredClass) {
            if (StringHelper::endsWith($declaredClass, $classFileName)) {
                return $declaredClass;
            }
        }
        throw new \Exception($classFileName." not found. Maybe you are missing a require() statement.");
    }

    /**
     * Finds all Test* files in $dir and runs them.
     *
     * @param string $dir   The directory to look into for all tests.
     * @param mixed  $suite The TestSuite to add all found test files.
     *
     * @return void
     * @see    KortAllTests
     */
    public static function runTestDirectory($dir, $suite)
    {
        $dir_handle = opendir($dir);
        while (false !== ($file = readdir($dir_handle))) {
            if (!is_dir($file) && $file != basename(__FILE__) && preg_match("/^Test.*\.php$/", $file)) {
                $filepath = $dir."/".$file;
                $suite->addFile($filepath);
                self::runTestFile($filepath);
            }
        }
    }
}
