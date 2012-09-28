# Database
/usr/bin/mysqldump -u redmine -p<password> redmine | gzip > /home/redmine/backup/redmine_`date +%y_%m_%d`.gz

# Attachments
rsync -a /home/redmine/redmine-2.1.0/files /home/redmine/backup/files
