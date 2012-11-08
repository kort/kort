#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
while getopts ":o:n:s:dp:" opt; do
    case $opt in
        o)  
            DB_OWNER="$OPTARG"
            ;;
        n)  
            DB_NAME="$OPTARG"
            ;;
        s)  
            DB_SCHEMA="$OPTARG"
            ;;
        d)  
            DROP_DB="true"
            ;;
        p)  
            PREVIOUS_DOWNLOAD="$OPTARG"
            ;;
        \?) # fall-through
            ;&
        :)  
            echo "USAGE: `basename $0` [-o <db owner>] [-n <database name>] [-s <schema name>] [-d drop database if exists] [-p path to previously downloaded error csv]" >&2
            echo "Example: `basename $0` -o `whoami` -n osm_bugs -s keepright -p /tmp/keepright_errors.txt" >&2
            exit 1
            ;;
    esac
done

if [ -z $DB_NAME ] ; then
    DB_NAME="osm_bugs"
fi

if [ -z $DB_SCHEMA ] ; then
    DB_SCHEMA="keepright"
fi

if [ -z $DB_OWNER ] ; then
    DB_OWNER=`whoami`
fi

if [[ $PREVIOUS_DOWNLOAD && ! -f $PREVIOUS_DOWNLOAD ]] ; then
    echo "Previous download '$PREVIOUS_DOWNLOAD' does not exist or is not a regular file."
    exit 1
fi


if [[ $DROP_DB ]] ; then
    echo "Dropping database $DB_NAME"
    psql -c "drop database if exists $DB_NAME;"

    echo "Create database $DB_NAME (Owner: $DB_OWNER)"
    createdb -E UTF8 -O $DB_OWNER $DB_NAME
else
    echo "Dropping schema $DB_SCHEMA"
    psql -d $DB_NAME -c "drop schema if exists $DB_SCHEMA cascade;"
fi

# Create schema
psql -d $DB_NAME -c "create schema $DB_SCHEMA authorization $DB_OWNER"
psql -d $DB_NAME -f $DIR/keepright.sql
psql -d $DB_NAME -c "alter table $DB_SCHEMA.errors owner to $DB_OWNER"

# Load keepright data
if [ -z $PREVIOUS_DOWNLOAD ] ; then
    wget -O - http://keepright.ipax.at/keepright_errors.txt.bz2 | bzcat | grep -f $DIR/whitelist_errors.txt > /tmp/keepright_errors.txt
else
    cp $PREVIOUS_DOWNLOAD /tmp/keepright_errors.txt
fi

echo "Splitting CSV in parts..."
split -l 200000 /tmp/keepright_errors.txt /tmp/kr_part
sed 1d /tmp/kr_partaa > /tmp/kr_partaa_wo && mv /tmp/kr_partaa_wo /tmp/kr_partaa
rm /tmp/keepright_errors.txt

echo "Start loading data"
for part_file in /tmp/kr_part*
do
    echo $part_file
    psql -d $DB_NAME -c "copy $DB_SCHEMA.errors from '$part_file' DELIMITER '	' null '\N' CSV;"
done
echo "End."
cat /tmp/kr_part* >> /tmp/keepright_errors.txt
rm /tmp/kr_part*
echo "Creating indices"
psql -d $DB_NAME -f $DIR/keepright_index.sql

echo "Cleanup data"
psql -d $DB_NAME -f $DIR/keepright_cleanup.sql

