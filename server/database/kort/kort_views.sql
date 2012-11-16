create or replace view kort.errors as
select  e.error_id id,
        e.schema,
        t.type,
        e.object_id osm_id,
        e.object_type osm_type,
        t.description title,
        t.view_type,
        t.answer_placeholder,
        e.msgid description,
        CAST(e.lat AS NUMERIC)/10000000 latitude,
        CAST(e.lon AS NUMERIC)/10000000 longitude,
        e.geom
from    keepright.errors e,
        keepright.error_type t
where   e.error_type_id = t.error_type_id;

create or replace view kort.tracktype as
select a.answer_id tracktype_id,
       a.value type_key,
       a.title,
       a.sorting
where  a.type = 'tracktype';

create or replace view kort.language as
select a.answer_id language_id,
       a.value language_key,
       a.title,
       a.sorting
where  a.type = 'language';

create or replace view kort.relationtype as
select a.answer_id relationtype_id,
       a.value type_key,
       a.title,
       a.sorting
where  a.type = 'relationtype';
