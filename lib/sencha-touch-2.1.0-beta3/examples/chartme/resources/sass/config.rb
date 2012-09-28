# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

# Load the sencha-touch framework automatically.
load File.join(dir, '..','..','..','SDK','touch','resources', 'themes')

# Compass configurations
images_path = File.join(dir, '..', 'images')
sass_path    = dir
css_path     = File.join(dir, "..", "css")
environment  = :production
output_style = :compressed