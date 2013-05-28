#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
while getopts ":o:n:s:dcmp:" opt; do
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
        c)
            CLEANUP="true"
            ;;
        m)
            MINIMAL_SETUP="true"
            ;;
        p)
            PREVIOUS_DOWNLOAD="$OPTARG"
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
    DB_SCHEMA="keepright"
fi

if [ -z $DB_OWNER ] ; then
    DB_OWNER=`whoami`
fi
echo "Drop views for kort"
for view in `psql -qAt -c "select table_schema || '.' || table_name from information_schema.views where table_schema = 'kort';" $DB_NAME` ; do  psql -c "drop table $view" $DB_NAME ; done

echo "Create views for kort"
psql -d $DB_NAME -f $DIR/kort/kort_views.sql
for view in `psql -qAt -c "select table_schema || '.' || table_name from information_schema.views where table_schema = 'kort';" $DB_NAME` ; do  psql -c "alter table $view owner to $DB_OWNER" $DB_NAME ; done
