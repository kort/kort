create extension dblink with schema osm_errors;

create sequence osm_errors.error_id;

create table osm_errors.errors (
    schema varchar(6) not null default '100',
    error_id integer default nextval('osm_errors.error_id'),
    error_type_id integer not null,
    error_name varchar(100) not null,
    object_type keepright.osm_type not null,
    object_id bigint PRIMARY KEY,
    lat integer not null,
    lon integer not null,
    geom public.geometry(Point,4326),
    msgid text,
    txt1 text,
    txt2 text,
    txt3 text,
    txt4 text,
    txt5 text
);

CREATE OR REPLACE RULE "osm_errors_replace" AS
    ON INSERT TO "errors"
    WHERE
      EXISTS(SELECT 1 FROM osm_errors.errors WHERE object_id=NEW.object_id)
    DO INSTEAD
       (UPDATE osm_errors.errors SET (error_id, schema, error_type_id, error_name, object_type, msgid, lat, lon, geom, txt1, txt2, txt3, txt4, txt5)=(NEW.error_id, NEW.schema, NEW.error_type_id, NEW.error_name, NEW.object_type, NEW.msgid, NEW.lat, NEW.lon, NEW.geom, NEW.txt1, NEW.txt2, NEW.txt3, NEW.txt4, NEW.txt5) WHERE object_id=NEW.object_id);