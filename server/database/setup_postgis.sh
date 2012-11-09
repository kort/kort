#!/bin/bash
DIR="$( cd "$( dirname "$0" )" && pwd )"
while getopts ":d:s:t:" opt; do
    case $opt in
        d)
            DB_NAME="$OPTARG"
            ;;
        s)
            SCHEMA_NAME="$OPTARG"
            ;;
        t)  
            TABLE_NAME="$OPTARG"
            ;;
        \?) # fall-through
            ;&
        :)  
            echo "USAGE: `basename $0` [-d <database name>] [-s <schema name>] [-t <table name>]" >&2
            echo "Example: `basename $0` -d osm_bugs -s keepright -t errors" >&2
            exit 1
            ;;
    esac
done

if [ -z $DB_NAME ] ; then
    DB_NAME="osm_bugs"
fi

if [ -z $SCHEMA_NAME ] ; then
    SCHEMA_NAME="keepright"
fi

if [ -z $TABLE_NAME ] ; then
    DB_NAME="errors"
fi

# install postgis using apt-get: apt-get install postgresql-9.1-postgis

# install extension
psql -d $DB_NAME -f /usr/share/postgresql/9.1/contrib/postgis-1.5/postgis.sql
psql -d $DB_NAME -f /usr/share/postgresql/9.1/contrib/postgis-1.5/spatial_ref_sys.sql

psql -d $DB_NAME -c "GRANT ALL ON geometry_columns TO PUBLIC;"
psql -d $DB_NAME -c "GRANT ALL ON spatial_ref_sys TO PUBLIC;"
psql -d $DB_NAME -c "GRANT ALL ON geography_columns TO PUBLIC;"

# add geometry to table
psql -d $DB_NAME -c "select AddGeometryColumn ('$SCHEMA_NAME','$TABLE_NAME','geom',4326,'POINT',2);"

# update table
psql -d $DB_NAME -c "update $SCHEMA_NAME.$TABLE_NAME set geom = ST_SetSRID(ST_MakePoint(lon/10000000.0,lat/10000000.0),4326);"

# create spatial index
psql -d $DB_NAME -c "create index geom_idx on $SCHEMA_NAME.$TABLE_NAME using gist(geom);"
