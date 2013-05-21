CREATE INDEX answer_type_idx ON kort.answer (type ASC NULLS LAST);
CREATE INDEX error_name_idx ON kort.error_type (type ASC NULLS LAST);
CREATE INDEX fix_idx ON fix(error_id, osm_id, schema) WHERE (complete and valid) OR (not complete);
