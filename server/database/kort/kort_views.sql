create or replace view kort.errors as
select error_id AS id,
        schema,
        error_type AS type,
        object_id AS osm_id,
        object_type AS osm_type,
        error_name AS title,
        msgid AS description,
        CAST(lat AS NUMERIC)/10000000 AS latitude,
        CAST(lon AS NUMERIC)/10000000 AS longitude,
        geom
from    keepright.errors;

alter table kort.errors owner to osm;
