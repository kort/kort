#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
while getopts ":d:t:" opt; do
    case $opt in
        d)  
            DB_NAME="$OPTARG"
            ;;
        t)  
            TABLE_NAME="$OPTARG"
            ;;
        \?) # fall-through
            ;&
        :)  
            echo "USAGE: `basename $0` [-d <database name>] [-t <table name>]" >&2
            echo "Example: `basename $0` -d osm_bugs -t keepright.errors" >&2
            exit 1
            ;;
    esac
done

if [ -z $DB_NAME ] ; then
    DB_NAME="osm_bugs"
fi

if [ -z $TABLE_NAME ] ; then
    DB_NAME="keepright.errors"
fi

# install postgis using apt-get: apt-get install postgresql-9.1-postgis

# install extension
psql -d $DB_NAME -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql
psql -d $DB_NAME -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql


# add geometry to table
psql -d $DB_NAME -c "alter table $TABLE_NAME ADD COLUMN geom geometry(POINT,4326);"

# update table
psql -d $DB_NAME -c "update $TABLE_NAME set geom = ST_SetSRID(ST_MakePoint(lon,lat),4326);"

# create spatial index
psql -d $DB_NAME -c "create index geom_idx ON $TABLE_NAME USING GIST(geom);"
