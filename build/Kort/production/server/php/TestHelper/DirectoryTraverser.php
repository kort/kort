<?php
/**
 * kort - TestHelper\DirectoryTraverser class
 */
namespace TestHelper;

/**
 * The DirectoryTraverser class provides functionality apply a function to each file in a directory.
 */
class DirectoryTraverser
{
    /**
     * Function object to be applied to a directory structure.
     *
     * @var callback
     */
    protected $block;

    /**
     * Create a new DirectoryTraverser object.
     *
     * @param callback|Closure $block Function to be applied to a directory structure.
     *
     * @throws \Exception If $block is not a callable object.
     */
    public function __construct($block)
    {
        if (!is_callable($block)) {
            throw new \Exception("Argument must be callable.");
        }
        $this->block = $block;
    }

    /**
     * Traverse over directory $dir and apply $block to each found file.
     *
     * @param string $dir The directory to traverse over.
     *
     * @return void
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
