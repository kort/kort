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
        \?) # fall-through
            ;&
        :)
            echo "USAGE: `basename $0` [-o <db owner>] [-n <database name>]" >&2
            exit 1
            ;;
    esac
done

if [ -z $DB_NAME ] ; then
    DB_NAME="osm_bugs"
fi

if [ -z $DB_OWNER ] ; then
    DB_OWNER=`whoami`
fi

#### error sources ###

echo "update error sources..."

###Keepright reletaded###
echo "start keepright related update"
$DIR/setup_keepright_db.sh -o kortuser -n osm_bugs -s keepright -c
echo "keepright related update ended"

###osm_errors reletaded###
echo "start osm_errors related update"
$DIR/setup_osm_errors_db.sh -o kortuser -n osm_bugs -s osm_errors
echo "osm_errors related update ended"

### consolidate error sources and build indexes###
echo "consolidate error sources..."
echo "start consolidation"
$DIR/setup_all_errors_db.sh -o kortuser -n osm_bugs -s all_errors
echo "consolidation ended"

### rebuild kort views and update kort data - errors are possible and tolerated ###
echo "rebuild kort views and update kort data"
$DIR/update_kort_db.sh -o kortuser -n osm_bugs -s kort
# rebuild kort indexes
psql -d $DB_NAME -c "REINDEX kort.answer;"
psql -d $DB_NAME -c "REINDEX kort.error_type;"




