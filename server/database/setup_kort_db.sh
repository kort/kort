#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
while getopts ":o:n:s:" opt; do
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
        \?) # fall-through
            ;&
        :)
            echo "USAGE: `basename $0` [-o <db owner>] [-n <database name>] [-s <schema name>] [-d drop database if exists] " >&2
            echo "Example: `basename $0` -o `whoami` -n osm_bugs -s kort" >&2
            exit 1
            ;;
    esac
done

if [ -z $DB_NAME ] ; then
    DB_NAME="osm_bugs"
fi

if [ -z $DB_SCHEMA ] ; then
    DB_SCHEMA="kort"
fi

if [ -z $DB_OWNER ] ; then
    DB_OWNER=`whoami`
fi

echo "Dropping schema $DB_SCHEMA"
psql -d $DB_NAME -c "drop schema if exists $DB_SCHEMA cascade;"

echo "Create schema $DB_SCHEMA (tables, sequences, types)"
psql -d $DB_NAME -c "create schema $DB_SCHEMA authorization $DB_OWNER"
psql -d $DB_NAME -f $DIR/kort/kort.sql
psql -d $DB_NAME -c "alter table $DB_SCHEMA.user owner to $DB_OWNER"
psql -d $DB_NAME -c "alter table $DB_SCHEMA.error_type owner to $DB_OWNER"

echo "Creating indexes"
psql -d $DB_NAME -f $DIR/kort/kort_index.sql

echo "Creating views"
psql -d $DB_NAME -f $DIR/kort/kort_views.sql

echo "Inserting data"
psql -d $DB_NAME -f $DIR/kort/kort_data.sql