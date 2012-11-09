create or replace view kort.errors as
select  e.error_id AS id,
        e.schema,
        t.type AS type,
        e.object_id AS osm_id,
        e.object_type AS osm_type,
        t.description AS title,
        e.msgid AS description,
        CAST(e.lat AS NUMERIC)/10000000 AS latitude,
        CAST(e.lon AS NUMERIC)/10000000 AS longitude,
        e.geom
from    keepright.errors e,
        keepright.error_type t
where   e.error_type_id = t.error_type_id;

alter table kort.errors owner to osm;
