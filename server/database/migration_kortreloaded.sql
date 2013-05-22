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