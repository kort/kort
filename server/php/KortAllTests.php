<?php
namespace Tests;

class KortAllTests extends \TestSuite {
    protected $reporter;

    public function __construct()
    {
        parent::__construct("kort - All tests");
        $this->reporter = new KortHTMLReporter();
    }

    public function run($reporter = null)
    {
        parent::run(($reporter == null) ? $this->reporter : $reporter);
    }
}
