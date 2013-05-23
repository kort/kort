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

####error sources###

###drop all error sources###
echo "drop all error sources..."
psql -d $DB_NAME -c "drop schema if exists keepright cascade;"
psql -d $DB_NAME -c "drop schema if exists osm_errors cascade;"
psql -d $DB_NAME -c "drop schema if exists all_errors cascade;"

###Update error sources###
echo "update error sources..."

###Keepright reletaded###
echo "start keepright related update"
$DIR/setup_keepright_db.sh -o kortuser -n osm_bugs -s keepright -c -l
echo "Generate geometry objects based on lat/lng values"
psql -d osm_bugs -c "update keepright.errors set geom = ST_SetSRID(ST_Point(lon/10000000.0,lat/10000000.0),4326);"
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
psql -d $DB_NAME -c "REINDEX TABLE kort.answer;"
psql -d $DB_NAME -c "REINDEX TABLE kort.error_type;"




