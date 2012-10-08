#!/bin/bash
# This script syncs the remotely created backup files (see redmine_backup.sh) to another machine
rsync -avz <user>@<host>:/home/redmine/backup/ /path/to/backup/location
