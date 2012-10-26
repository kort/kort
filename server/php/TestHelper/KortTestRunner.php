<?php
namespace TestHelper;

use Helper\StringHelper;
class KortTestRunner
{
	public static function runTestFile($file)
	{
		require_once($file);
		$className = self::findClass(basename($file,".php"));
		$refClass = new \ReflectionClass($className);
        $unitTestCase = $refClass->newInstance();
		$unitTestCase->report();
	}

    private static function findClass($className) {
        foreach(get_declared_classes() as $declaredClass) {
            if (StringHelper::endsWith($declaredClass,$className)) {
                return $declaredClass;
            }
        }
        throw new \Exception($className." not found. Maybe you are missing a require() statement.");
    }

	public static function runTestDirectory($dir,$suite)
    {
        $dir_handle = opendir($dir);
        while (false !== ($file = readdir($dir_handle)))
        {
            if (!is_dir($file) && $file != basename(__FILE__) && preg_match("/^Test.*\.php$/",$file))
            {
                $filepath = $dir."/".$file;
                $suite->addFile($filepath);
                self::runTestFile($filepath);
            }
        }
	}
}
