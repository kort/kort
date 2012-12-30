-- reduce amount of data
delete from keepright.errors where schema::numeric between 20 and 75;

vacuum full keepright.errors;
reindex database osm_bugs;
