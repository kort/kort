# Dependencies of kort

* PostgreSQL and PostGIS
    * `apt-get install postgresql`
    * `apt-get install python-software-properties`
    * `apt-get install software-properties-common`
    * `apt-add-repository ppa:sharpie/postgis-stable`
    * `apt-add-repository ppa:ubuntugis/ubuntugis-unstable`
    * `apt-get update`
    * `apt-get install postgresql-9.1-postgis`
    * `apt-get install postgresql-contrib-9.1`
* PHP (5.3 or 5.4)
    * `apt-get install php5`
    * `apt-get install php5-curl`
* Composer
    * `curl -s https://getcomposer.org/installer | php`
    * `php composer.phar install --dev`
* RubyGems 
    * `apt-get install rubygems`
    * `gem install sass`
    * `gem install compass`
    * `gem install jsduck`
* NPM
    * `apt-get install npm`
    * `npm -g install grunt`
* Ant
    * `apt-get install ant`
    * `ant -f build_kort.xml build`

# Database

The following commands must be run with user "postgres" (`su - postgres`):

* Create a new db user
    * `createuser -S -D -R -P kortuser`
* Create a new empty database
    * `createdb osm_bugs`
* Install schema keepright
    * `server/database/setup_keepright_db.sh -o kortuser -n osm_bugs -s keepright -d` (option -m installs a minimal setup, omit to load keepright data)
* Install schema osm_errors
    * `server/database/setup_osm_errors_db.sh -o kortuser -n osm_bugs -s osm_errors`
* Install schema all_errors
    * `server/database/setup_all_errors_db.sh -o kortuser -n osm_bugs -s all_errors`
* Install schema kort
    * `server/database/setup_kort_db.sh -o kortuser -n osm_bugs -s kort`

