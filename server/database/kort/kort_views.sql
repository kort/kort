create or replace view kort.all_errors as
select  e.error_id,
        e.schema,
        e.error_type_id,
        e.object_id osm_id,
        e.object_type osm_type,
        e.msgid description,
        CAST(e.lat AS NUMERIC)/10000000 latitude,
        CAST(e.lon AS NUMERIC)/10000000 longitude,
        e.geom,
        e.txt1,
        e.txt2,
        e.txt3,
        e.txt4,
        e.txt5
from    keepright.errors e;

create or replace view kort.errors as
select  e.error_id id,
        e.schema,
        t.type,
        e.osm_id,
        e.osm_type,
        t.description title,
        t.view_type,
        t.answer_placeholder,
        e.description,
        t.fix_koin_count,
        t.vote_koin_count,
        e.latitude,
        e.longitude,
        e.geom,
        e.txt1,
        e.txt2,
        e.txt3,
        e.txt4,
        e.txt5
from    kort.all_errors e,
        kort.error_type t
where   e.error_type_id = t.error_type_id
and     not exists (select 1 from kort.fix f where f.error_id = e.error_id and ((f.complete and f.valid) or not f.complete));

create or replace view kort.validations as
select  f.fix_id id,
        f.user_id fix_user_id,
        e.osm_id,
        e.osm_type,
        t.description title,
        t.type,
        t.view_type,
        t.vote_question question,
        t.vote_koin_count,
        f.message fixmessage,
       (select count(1) from kort.vote v where v.fix_id = f.fix_id and v.valid) upratings,
       (select count(1) from kort.vote v where v.fix_id = f.fix_id and not v.valid) downratings,
        t.required_votes,
        e.latitude,
        e.longitude,
        e.geom
from    kort.all_errors e,
        kort.error_type t,
        kort.fix f
where   e.error_type_id = t.error_type_id
and     f.error_id = e.error_id
and     f.schema = e.schema
and     f.osm_id = e.osm_id
and     not f.complete;

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
       u.oauth_user_id,
       u.oauth_provider,
       u.token,
       u.secret,
       u.koin_count,
       (select count(1) from kort.fix f where f.user_id = u.user_id) fix_count,
       (select count(1) from kort.vote v where v.user_id = u.user_id) vote_count
from   kort.user u;

create or replace view kort.user_badges as
select b.badge_id id,
       b.name,
       b.title,
       b.description,
       b.color,
       b.sorting
from   kort.badge b
order by b.sorting;

create or replace view kort.highscore as
select rank() over (order by u.koin_count desc) ranking,
       u.user_id user_id,
       u.username,
       u.oauth_user_id,
       u.koin_count,
       (select count(1) from kort.fix f where f.user_id = u.user_id) fix_count,
       (select count(1) from kort.vote v where v.user_id = u.user_id) vote_count
from   kort.user u
where  u.username is not null
order by ranking;

create or replace view kort.error_types as
select t.error_type_id,
       t.type,
       t.description,
       t.view_type,
       t.answer_placeholder,
       t.vote_question,
       t.vote_koin_count,
       t.fix_koin_count,
       t.required_votes
from   kort.error_type t;
