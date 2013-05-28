CREATE INDEX error_id_idx ON osm_errors.errors (error_id ASC NULLS LAST);
CREATE INDEX lat_idx ON osm_errors.errors (lat ASC NULLS LAST);
CREATE INDEX lon_idx ON osm_errors.errors (lon ASC NULLS LAST);
CREATE INDEX object_type_idx ON osm_errors.errors (object_type ASC NULLS LAST);
CREATE INDEX error_type_id_idx ON osm_errors.errors (error_type_id ASC NULLS LAST);
create index geom_idx on osm_errors.errors using gist(geom);