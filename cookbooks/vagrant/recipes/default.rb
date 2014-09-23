bash "set default locale to UTF-8" do
  code <<-EOH
update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8
dpkg-reconfigure locales
EOH
end
#
# dont't prompt for host key verfication (if any)
template "/home/vagrant/.ssh/config" do
  user "vagrant"
  group "vagrant"
  mode "0600"
  source "config"
end

execute "apt-get update"
package "python-software-properties"

bash "Add PPA for latest PHP and PostGIS" do
  code <<-EOH
  sudo add-apt-repository ppa:ondrej/php5
  sudo apt-add-repository ppa:sharpie/for-science
  sudo apt-add-repository ppa:sharpie/postgis-nightly
  EOH
end

execute "apt-get update"

# install the software we need
%w(
curl
tmux
vim
git
postgresql-9.1
postgresql-9.1-postgis
postgresql-contrib-9.1
php5
php5-dev
php5-curl
php5-cli
php5-intl
php5-memcache
php5-pgsql
php5-mcrypt
memcached
apache2
libapache2-mod-php5
nodejs
build-essential
openssl
libssl-dev
).each { | pkg | package pkg }

template "/home/vagrant/.bash_aliases" do
  user "vagrant"
  mode "0644"
  source ".bash_aliases.erb"
end

template "/home/vagrant/.bash_profile" do
  user "vagrant"
  group "vagrant"
  source ".bash_profile"
end

execute "a2enmod rewrite"
execute "a2enmod php5"

service "apache2" do
  supports :restart => true, :reload => true, :status => true
  action [ :enable, :start ]
end

service "postgres" do
  supports :restart => true, :reload => true, :status => true
  action [ :enable, :start ]
end

file "/etc/apache2/sites-enabled/000-default.conf" do
  action :delete
end

template "/etc/apache2/sites-enabled/vhost.conf" do
  user "root"
  mode "0644"
  source "vhost.conf.erb"
  notifies :reload, "service[apache2]"
end

execute "date.timezone = UTC in php.ini?" do
 user "root"
 not_if "grep 'date.timezone = UTC' /etc/php5/cli/php.ini"
 command "echo -e '\ndate.timezone = UTC\n' >> /etc/php5/cli/php.ini"
end

bash "retrieve composer" do
  user "vagrant"
  cwd "/vagrant"
  code <<-EOH
  set -e

  # check if composer is installed
  if [ ! -f composer.phar ]
  then
    curl -s https://getcomposer.org/installer | php
  else
    php composer.phar selfupdate
  fi
  EOH
end

template "/vagrant/server/php/Webservice/DbWebserviceConfig.php" do
  user "vagrant"
  group "vagrant"
  source "DbWebserviceConfig.php"
end

template "/vagrant/server/php/Webservice/Database/DbConfig.php" do
  user "vagrant"
  group "vagrant"
  source "DbConfig.php"
end

template "/etc/postgresql/9.1/main/pg_hba.conf" do
  user "postgres"
  group "postgres"
  source "pg_hba.conf"
end

bash "Setup PostgreSQL user" do
  user "postgres"
  cwd "/vagrant"
  notifies :reload, "service[postgres]"
  code <<-EOH
  set -e
  psql -c "CREATE USER kortdbuser WITH PASSWORD 'kortVagrant'"
  EOH
end

bash "Setup PostgreSQL database" do
  user "postgres"
  cwd "/vagrant/server/database"
  code <<-EOH
  set -e
  ./setup_keepright_db.sh -o kortdbuser -n kortdb -d -m
  ./setup_osm_errors_db.sh -o kortdbuser -n kortdb -m
  ./setup_all_errors_db.sh -o kortdbuser -n kortdb
  ./setup_kort_db.sh -o kortdbuser -n kortdb
  EOH
end

bash "Load fixtures" do
  user "postgres"
  cwd "/vagrant"
  code <<-EOH
  set -e
  psql -d kortdb -f /vagrant/server/database/all_errors/fixtures.sql
  EOH
end
