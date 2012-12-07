-- reduce amount of data
delete from keepright.errors where schema::numeric < 80;

vacuum full keepright.errors;
reindex database osm_bugs;