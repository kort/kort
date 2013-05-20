CREATE INDEX error_id_idx ON keepright.errors (error_id ASC NULLS LAST);
CREATE INDEX lat_idx ON keepright.errors (lat ASC NULLS LAST);
CREATE INDEX lon_idx ON keepright.errors (lon ASC NULLS LAST);
CREATE INDEX object_type_idx ON keepright.errors (object_type ASC NULLS LAST);
CREATE INDEX state_idx ON keepright.errors (state ASC NULLS LAST);
CREATE INDEX error_type_id_idx ON keepright.errors (error_type_id ASC NULLS LAST);
