<?php

/* Simply require this file if you need SimpleTest / Kort Testing functionality */

//SimpleTest Library
require_once(dirname(__FILE__) . '/../lib/simpletest/reporter.php');
require_once(dirname(__FILE__) . '/../lib/simpletest/test_case.php');
require_once(dirname(__FILE__) . '/../lib/simpletest/unit_tester.php');

require_once(dirname(__FILE__) . '/../server/php/TestHelper/KortUnitTestCase.php');
require_once(dirname(__FILE__) . '/../server/php/TestHelper/KortAllTests.php');
require_once(dirname(__FILE__) . '/../server/php/TestHelper/KortCliReporter.php');
require_once(dirname(__FILE__) . '/../server/php/TestHelper/KortHTMLReporter.php');
require_once(dirname(__FILE__) . '/../server/php/TestHelper/KortTestRunner.php');
require_once(dirname(__FILE__) . '/../server/php/TestHelper/DirectoryTraverser.php');