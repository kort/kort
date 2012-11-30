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

echo "Creating indexes"
psql -d $DB_NAME -f $DIR/kort/kort_index.sql

echo "Creating views"
psql -d $DB_NAME -f $DIR/kort/kort_views.sql

echo "Transfer ownership of all objects to $DB_OWNER"
for tbl in `psql -qAt -c "select schemaname || '.' || tablename from pg_tables where schemaname = '$DB_SCHEMA';" $DB_NAME` ; do  psql -c "alter table $tbl owner to $DB_OWNER" $DB_NAME ; done
for seq in `psql -qAt -c "select sequence_schema || '.' || sequence_name from information_schema.sequences where sequence_schema = '$DB_SCHEMA';" $DB_NAME` ; do  psql -c "alter sequence $seq owner to $DB_OWNER" $DB_NAME ; done
for view in `psql -qAt -c "select table_schema || '.' || table_name from information_schema.views where table_schema = '$DB_SCHEMA';" $DB_NAME` ; do  psql -c "alter table $view owner to $DB_OWNER" $DB_NAME ; done

echo "Inserting data"
psql -d $DB_NAME -f $DIR/kort/kort_data.sql
