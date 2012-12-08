CREATE UNIQUE INDEX oauth_user_idx ON kort.user (oauth_provider, oauth_user_id);
CREATE UNIQUE INDEX secret_idx ON kort.user (secret);
CREATE UNIQUE INDEX validation_unique_idx ON kort.validation (user_id, fix_id);
CREATE UNIQUE INDEX fix_unique_idx ON kort.fix (user_id, error_id, schema, osm_id);
CREATE INDEX answer_type_idx ON kort.answer (type ASC NULLS LAST);
CREATE INDEX error_type_id_idx ON kort.errors (error_type_id ASC NULLS LAST);
CREATE INDEX error_name_idx ON kort.error_type (type ASC NULLS LAST);
