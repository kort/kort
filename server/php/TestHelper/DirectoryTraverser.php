<?php
namespace TestHelper;

class DirectoryTraverser {
    protected $block;

    public function __construct($block) {
        if (!is_callable($block)) {
            throw Exception("Argument must be callable.");
        }
        $this->block = $block;
    }

    public function traverse($dir) {
        echo "traverse(".$dir.")";
        $dh = opendir($dir);
        while (($file = readdir($dh)) !== false) {
            echo $file;
            if (is_dir($file) && $file != "." &&  $file != "..") {
                call_user_func($this->block,$dir,$file);
                $this->traverse($dir."/".$file);
            }
        }
        closedir($dh);
    }
}

?>
