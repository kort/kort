#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
while getopts ":o:n:s:c:" opt; do
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
        c)
            CLEANUP="true"
            ;;
        \?) # fall-through
            ;&
        :)
            echo "USAGE: `basename $0` [-o <db owner>] [-n <database name>] [-s <schema name>] [-d drop database if exists] [-c cleanup data after import] [-p path to previously downloaded error csv] [-m minimal setup]" >&2
            echo "Example: `basename $0` -o `whoami` -n osm_bugs -s keepright -p /tmp/keepright_errors.txt" >&2
            exit 1
            ;;
    esac
done

if [ -z $DB_NAME ] ; then
    DB_NAME="osm_bugs"
fi

if [ -z $DB_SCHEMA ] ; then
    DB_SCHEMA="all_errors"
fi

if [ -z $DB_OWNER ] ; then
    DB_OWNER=`whoami`
fi

# Drop schema
echo "Dropping schema $DB_SCHEMA"
psql -d $DB_NAME -c "drop schema if exists $DB_SCHEMA cascade;"

# Create schema
psql -d $DB_NAME -c "create schema $DB_SCHEMA authorization $DB_OWNER"
psql -d $DB_NAME -f $DIR/all_errors/all_errors.sql
echo "Transfer ownership of all objects to $DB_OWNER"
for tbl in `psql -qAt -c "select schemaname || '.' || tablename from pg_tables where schemaname = '$DB_SCHEMA';" $DB_NAME` ; do  psql -c "alter table $tbl owner to $DB_OWNER" $DB_NAME ; done

# Consolidate all errors
echo "Consolidate all errors"
psql -d $DB_NAME -f $DIR/all_errors/all_errors_consolidate.sql

# Create indexes
echo "Creating indexes"
psql -d $DB_NAME -f $DIR/all_errors/all_errors_index.sql

if [[ $CLEANUP ]] ; then
    echo "Cleanup data"
    psql -d $DB_NAME -f $DIR/all_errors/all_errors_cleanup.sql
else
    echo "Omitting cleanup"
fi


