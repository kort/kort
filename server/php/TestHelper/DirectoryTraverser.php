<?php
namespace TestHelper;

class DirectoryTraverser
{
    protected $block;

    public function __construct($block)
    {
        if (!is_callable($block)) {
            throw new \Exception("Argument must be callable.");
        }
        $this->block = $block;
    }

    public function traverse($dir)
    {
        $dh = opendir($dir);
        while (($file = readdir($dh)) !== false) {
            if (is_dir($dir."/".$file) && $file != "." &&  $file != "..") {
                \call_user_func($this->block, $dir, $file);
                $this->traverse($dir."/".$file);
            }
        }
        closedir($dh);
    }
}
