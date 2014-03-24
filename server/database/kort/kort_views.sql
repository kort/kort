create or replace view kort.all_errors as
select  e.source,
        e.error_id,
        e.schema,
        e.error_type_id,
        e.osm_id,
        e.osm_type,
        e.description,
        CAST(e.latitude AS NUMERIC)/10000000 latitude,
        CAST(e.longitude AS NUMERIC)/10000000 longitude,
        e.geom,
        e.txt1,
        e.txt2,
        e.txt3,
        e.txt4,
        e.txt5
from    all_errors.errors e;

create or replace view kort.errors as
select  e.error_id id,
        e.schema,
        t.type,
        e.osm_id,
        e.osm_type,
        t.description title,
        t.view_type,
        t.answer_placeholder,
        t.bug_question description,
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
and     not exists (
        select 1
        from kort.fix f
        where f.error_id = e.error_id
        and   f.osm_id = e.osm_id
        and   f.schema = e.schema
        and ((f.complete and f.valid) or (not f.complete)));

create or replace view kort.validations as
select  f.fix_id id,
        f.user_id fix_user_id,
        e.osm_id,
        e.osm_type,
        t.description title,
        t.type,
        t.view_type,
        t.vote_question question,
        t.bug_question,
        t.vote_koin_count,
        f.message fixmessage,
        f.falsepositive,
       (select count(1) from kort.vote v where v.fix_id = f.fix_id and v.valid) upratings,
       (select count(1) from kort.vote v where v.fix_id = f.fix_id and not v.valid) downratings,
        t.required_votes,
        e.latitude,
        e.longitude,
        e.geom,
        e.txt1,
        e.txt2,
        e.txt3,
        e.txt4,
        e.txt5
from    kort.all_errors e,
        kort.error_type t,
        kort.fix f
where   e.error_type_id = t.error_type_id
and     f.error_id = e.error_id
and     f.schema = e.schema
and     f.osm_id = e.osm_id
and     not f.complete;

create or replace view kort.all_fixes as
select f.fix_id,
       f.user_id,
       u.username,
       f.create_date,
       to_char(f.create_date, 'DD.MM.YYYY HH24:MI:SS') formatted_create_date,
       f.osm_id,
       e.osm_type,
       e.latitude,
       e.longitude,
       e.error_id,
       e.schema,
       t.type error_type,
       t.description error_type_description,
       e.source,
       t.osm_tag,
       f.message answer,
       f.falsepositive,
       a.title description,
       f.complete,
       f.valid,
       f.in_osm,
       t.required_votes,
       (select count(1) from kort.vote v where v.fix_id = f.fix_id and v.valid) upratings,
       (select count(1) from kort.vote v where v.fix_id = f.fix_id and not v.valid) downratings
from   kort.fix f
inner join kort.user u on f.user_id = u.user_id
inner join kort.all_errors e on e.error_id = f.error_id and e.schema = f.schema and e.osm_id = f.osm_id
inner join kort.error_type t on e.error_type_id = t.error_type_id
left  join kort.answer a on a.type = t.type and a.value = f.message;

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

CREATE or replace VIEW kort.highscore AS
SELECT Rank()
         over (
           ORDER BY u.koin_count DESC)    AS ranking,
	   ROW_NUMBER()
		 over (
		   ORDER BY u.koin_count DESC) AS rownumber,
       u.user_id,
       u.username,
       u.pic_url,
       u.oauth_user_id,
       u.koin_count,
       (SELECT Count(1) AS count
        FROM   kort.fix f
        WHERE  ( f.user_id = u.user_id )) AS fix_count,
       (SELECT Count(1) AS count
        FROM   kort.vote v
        WHERE  ( v.user_id = u.user_id )) AS vote_count
FROM   kort.user u
WHERE  ( u.username IS NOT NULL )
ORDER  BY Rank()
            over (
              ORDER BY u.koin_count DESC);

CREATE or replace VIEW kort.user_model AS
SELECT u.user_id                           AS id,
       u.name,
       u.username,
       u.pic_url,
       u.oauth_user_id,
       u.oauth_provider,
       u.token,
       u.secret,
       u.koin_count,
       (SELECT Count(1) AS count
        FROM   kort.fix f
        WHERE  ( f.user_id = u.user_id ))  AS fix_count,
       (SELECT Count(1) AS count
        FROM   kort.vote v
        WHERE  ( v.user_id = u.user_id ))  AS vote_count,
       (SELECT hs.ranking
        FROM   (SELECT highscore.ranking,
                       highscore.user_id
                FROM   kort.highscore) hs
        WHERE  ( hs.user_id = u.user_id )) AS ranking,
       (SELECT hs2.rownumber
        FROM   (SELECT highscore.rownumber,
                       highscore.user_id
                FROM   kort.highscore) hs2
        WHERE  ( hs2.user_id = u.user_id )) AS rownumber
FROM   kort.user u;

create or replace view kort.user_badges as
select b.badge_id id,
       b.name,
       b.title,
       b.description,
       b.color,
       b.sorting
from   kort.badge b
order by b.sorting;


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

create or replace view kort.all_running_promotions as
select p.id AS promo_id,
	   p.startdate,
       p.enddate,
       p.geom AS promogeom,
       pm.error_type,
       pm.mission_extra_coins,
	   pm.validation_extra_coins
FROM   (kort.promotion p
        join kort.promo2mission pm
          ON (( p.id = pm.promo_id )))
WHERE  ( ( p.startdate <= Now() )
         AND ( p.enddate >= Now() ) );

create or replace view kort.all_missions_with_promotions AS
SELECT er.error_id AS mission_error_id,
       er.schema,
       er.osm_id,
       p.promo_id,
       p.mission_extra_coins AS promo_extra_coins
FROM   ((kort.all_errors e left join kort.error_types t on e.error_type_id = t.error_type_id) er
        join kort.all_running_promotions p
          ON (( ( er.type ) :: text = ( p.error_type ) :: text )))
WHERE  public._st_contains(p.promogeom, er.geom);

create or replace view kort.aggregateddata_from_all_missions as
SELECT er.error_id AS mission_error_id,
 	   er.schema,
	   er.osm_id,
	   er.fix_koin_count,
       p.promo_id,
	   p.promo_extra_coins
FROM   (kort.all_errors e left join kort.error_types t on e.error_type_id = t.error_type_id) er
        left join kort.all_missions_with_promotions p
               ON (( er.error_id = p.mission_error_id) AND (er.schema = p.schema) AND (er.osm_id = p.osm_id));

create or replace view kort.all_validations_with_promotions as
SELECT v.id,
	   p.promo_id,
       p.validation_extra_coins AS promo_extra_coins
FROM   kort.validations v left join kort.all_running_promotions p ON(v.type = p.error_type)
WHERE public._st_contains(p.promogeom, v.geom);

create or replace view kort.aggregateddata_from_all_validations as
SELECT v.id,
	   v.vote_koin_count,
	   p.promo_id,
       p.promo_extra_coins
FROM   kort.validations v left join kort.all_validations_with_promotions p
               ON (v.id = p.id);



create or replace view kort.statistics as
select
(select count(*) from kort.fix) fix_count,
(select count(*) from kort.fix where falsepositive) falsepositive_fix_count,
(select count(*) from kort.fix where complete) complete_fix_count,
(select count(*) from kort.fix where not complete) incomplete_fix_count,
(select count(*) from kort.fix where complete and valid) validated_fix_count,
(select count(*) from kort.user where oauth_provider != '') user_count,
(select count(*) from kort.user where koin_count > 0) active_user_count,
(select count(*) from kort.user where oauth_provider = 'OpenStreetMap') osm_user_count,
(select count(*) from kort.user where oauth_provider = 'Google') google_user_count,
(select count(*) from kort.user where oauth_provider = 'Facebook') fb_user_count,
(select count(*) from kort.vote) vote_count,
(select count(*) from kort.vote where valid) valid_vote_count,
(select count(*) from kort.vote where not valid) invalid_vote_count,
(select count(*) from kort.user_badge) badge_count,
(select count(*) from kort.user_badge where badge_id = 1) first_place_badge_count,
(select count(*) from kort.user_badge where badge_id = 2) second_place_badge_count,
(select count(*) from kort.user_badge where badge_id = 3) third_place_badge_count,
(select count(*) from kort.user_badge where badge_id = 4) hundred_missions_badge_count,
(select count(*) from kort.user_badge where badge_id = 5) fifty_missions_badge_count,
(select count(*) from kort.user_badge where badge_id = 6) ten_missions_badge_count,
(select count(*) from kort.user_badge where badge_id = 7) thousand_checks_badge_count,
(select count(*) from kort.user_badge where badge_id = 8) hundred_checks_badge_count,
(select count(*) from kort.user_badge where badge_id = 9) ten_checks_badge_count,
(select count(*) from kort.user_badge where badge_id = 10) first_mission_badge_count,
(select count(*) from kort.user_badge where badge_id = 11) first_check_badge_count;
