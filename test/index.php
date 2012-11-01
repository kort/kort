<?php
require_once('../server/php/ClassLoader.php');
Kort\ClassLoader::registerAutoLoader("test");

function exception_error_handler($errno, $errstr, $errfile, $errline ) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
}
set_error_handler("exception_error_handler");

//run one specific Testfile or all available tests in this directory
if (isset($argv[1]) || isset($_GET['file'])) {
    $filename = isset($argv[1]) ? $argv[1] : $_GET['file'];
    if (file_exists($filename)) {
        TestHelper\KortTestRunner::runTestFile($filename);
    } else {
        die("Requested file '".$filename."' does not exist!");
    }

} else {
    //run tests in test directory
    $suite = new TestHelper\KortAllTests();
    $traverser = new TestHelper\DirectoryTraverser(function ($path, $dir) use ($suite) {
        if ($dir === "Test") {
            TestHelper\KortTestRunner::runTestDirectory($path."/".$dir, $suite);
        }
    });
    ob_start();
    $traverser->traverse(__DIR__.'/../server/php');
    $singleTestOutput = ob_get_contents();
    ob_end_clean();
    $suite->run();
    echo "<h1>Detailed test results:</h1>";
    echo $singleTestOutput;
}
