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
from   kort.answer a
where  a.type = 'missing_track_type';

create or replace view kort.language as
select a.answer_id language_id,
       a.value language_key,
       a.title,
       a.sorting
from   kort.answer a
where  a.type = 'language_unknown';

create or replace view kort.relationtype as
select a.answer_id relationtype_id,
       a.value type_key,
       a.title,
       a.sorting
from   kort.answer a
where  a.type = 'relationtype';

create or replace view kort.religion as
select a.answer_id religion_id,
       a.value type_key,
       a.title,
       a.sorting
from   kort.answer a
where  a.type = 'religion';

create or replace view kort.select_answer as
select a.answer_id id,
       a.type,
       a.value,
       a.title,
       a.sorting
from   kort.answer a;

create or replace view kort.user_model as
select u.user_id id,
       u.name,
       u.username,
       u.email,
       u.token,
       u.koin_count,
       (select count(1) from kort.fix f where f.user_id = u.user_id) fix_count,
       (select count(1) from kort.validation v where v.user_id = u.user_id) validation_count
from   kort.user u;