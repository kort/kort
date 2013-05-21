CREATE INDEX error_id_idx ON all_errors.errors (error_id ASC NULLS LAST);
CREATE INDEX lat_idx ON all_errors.errors (latitude ASC NULLS LAST);
CREATE INDEX lon_idx ON all_errors.errors (longitude ASC NULLS LAST);
CREATE INDEX object_type_idx ON all_errors.errors (osm_type ASC NULLS LAST);
CREATE INDEX error_type_id_idx ON all_errors.errors (error_type_id ASC NULLS LAST);
CREATE INDEX geom_idx ON all_errors.errors USING gist(geom);