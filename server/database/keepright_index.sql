ALTER TABLE keepright.errors
  ADD CONSTRAINT errors_pkey PRIMARY KEY(schema , error_id , object_id );
CREATE INDEX keepright.error_id#idx
   ON keepright.errors (error_id ASC NULLS LAST);
CREATE INDEX keepright.lat#idx
   ON keepright.errors (lat ASC NULLS LAST);
CREATE INDEX keepright.lon#idx
   ON keepright.errors (lon ASC NULLS LAST);
CREATE INDEX keepright.object_type#idx
   ON keepright.errors (object_type ASC NULLS LAST);
CREATE INDEX keepright.state#idx
   ON keepright.errors (state ASC NULLS LAST);
CREATE INDEX keepright.error_type#idx
   ON keepright.errors (error_type ASC NULLS LAST);
CREATE INDEX keepright.error_name#idx
   ON keepright.errors (error_name ASC NULLS LAST);
