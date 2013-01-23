-- reduce amount of data
delete from keepright.errors where schema::numeric between 26 and 45;

vacuum full keepright.errors;
reindex database osm_bugs;
