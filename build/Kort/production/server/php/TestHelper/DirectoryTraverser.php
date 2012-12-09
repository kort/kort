<?php
/**
 * kort - TestHelper\DirectoryTraverser class
 */
namespace TestHelper;

/**
 * The DirectoryTraverser class provides functionality to traverse over a directory
 * structure and apply a function to each file.
 */
class DirectoryTraverser
{
    /** Function object to be applied to a directory structure */
    protected $block;

    /**
     * Create a new DirectoryTraverser object
     * @param callback $block a function to be applied to a directory structure
     * @throws \Exception if $block is not a callable object
     */
    public function __construct($block)
    {
        if (!is_callable($block)) {
            throw new \Exception("Argument must be callable.");
        }
        $this->block = $block;
    }

    /**
     * Traverse over directory $dir and apply $block to each found file
     * @param string $dir the directory to traverse over
     */
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
