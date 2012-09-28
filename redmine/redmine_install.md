Install Redmine on Ubuntu and MySQL
====================================

see http://www.redmine.org/projects/redmine/wiki/RedmineInstall for details

0. Create a new user "redmine" on the target server, add to sudoers
# adduser redmine
# usermod -G admin redmine
# su redmine

0. Install Pre-requirsite packages
# apt-get install gem
# apt-get install libmysql-ruby
# apt-get install libmysqlclient-dev
# apt-get install imagemagick

1. Download Redmine on RubyForge
$ wget http://rubyforge.org/frs/download.php/76448/redmine-2.1.0.tar.gz) 

2. Unpack Redmine
$ tar xvfz redmine-2.1.0.tar.gz
$ cd redmine-2.1.0

3. Install Bundler
$ sudo gem install bundler

4. Install all gems required by Redmine
$ sudo bundle install --without development test postgresql sqlite rmagick

5. Create the database
$ sudo mysql
create database redmine character set utf8;
create user 'redmine'@'localhost' identified by 'my_password';
grant all privileges on redmine.* to 'redmine'@'localhost';

6. Copy and edit database settings
$ cp config/database.yml.example config/database.yml
production:
  adapter: mysql
  database: redmine
  host: localhost
  username: redmine
  password: my_password

7. Generate session store secret
$ rake generate_secret_token

8. Create the inital database
$ RAILS_ENV=production rake db:migrate

9. Load default data
$ RAILS_ENV=production rake redmine:load_default_data

10. Setup permissions
$ mkdir tmp public/plugin_assets
$ sudo chown -R redmine:redmine files log tmp public/plugin_assets
$ sudo chmod -R 755 files log tmp public/plugin_assets
# usermod, remove redmine from sudoers

11. Test installation
$ ruby script/rails server webrick -e production

12. Setup a start script to run webrick
# cp redmine_startscript.sh /etc/init.d/redmine
# chmod +x /etc/init.d/redmine
# update-rc.d redmine defaults

13. Setup daily backups
# Database
/usr/bin/mysqldump -u <username> -p<password> <redmine_database> | gzip > /path/to/backup/db/redmine_`date +%y_%m_%d`.gz

# Attachments
rsync -a /path/to/redmine/files /path/to/backup/files
