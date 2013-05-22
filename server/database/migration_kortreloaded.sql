drop view if exists kort.aggregateddata_from_all_missions;
drop view if exists kort.aggregateddata_from_all_validations;
drop view if exists kort.all_missions_with_promotions;
drop view if exists kort.all_validations_with_promotions;
drop view if exists kort.all_running_promotions;
drop view if exists kort.validations;
drop view if exists kort.all_fixes;
drop view if exists kort.errors;
drop view if exists kort.all_errors;
drop view if exists kort.error_types;
drop view if exists kort.user_model;
drop view if exists kort.highscore;
drop view if exists kort.language;
drop view if exists kort.relationtype;
drop view if exists kort.religion;
drop view if exists kort.select_answer;
drop view if exists kort.statistics;
drop view if exists kort.user_badges;

alter table kort.fix drop constraint only_one_pending_per_error;

ALTER TABLE kort.fix ALTER COLUMN error_id TYPE bigint USING error_id::bigint;
ALTER TABLE kort.fix ALTER COLUMN osm_id TYPE bigint USING osm_id::bigint;


create or replace function check_fix_onlyone_pending_per_error(i_error_id bigint, i_schema varchar, i_osm_id bigint)
returns boolean as
$$
select
case count(1)
	when 0 then true
	when 1 then true
	else false
end
from kort.fix
where error_id = $1
and   schema = $2
and   osm_id = $3
and   not complete
$$ language 'sql';

alter table kort.fix add constraint only_one_pending_per_error CHECK (check_fix_onlyone_pending_per_error(error_id, schema, osm_id));