create sequence kort.fix_id;
create sequence kort.vote_id;
create sequence kort.user_id;

create function check_fix_onlyone_pending_per_error(i_error_id integer, i_schema varchar, i_osm_id integer)
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

create or replace function reset_kort() returns boolean as $$
begin
    update kort.user set koin_count = 0;
    delete from kort.user_badge;
    delete from kort.vote;
    delete from kort.fix;

    return true;
exception
    when others then
       return false;
end;
$$ language plpgsql;

create table kort.error_type (
    error_type_id integer primary key,
    type character varying(20) not null,
    description character varying(255),
    osm_tag character varying(100),
    view_type character varying(50),
    answer_placeholder character varying(100),
    vote_question character varying(255),
    vote_koin_count integer not null,
    fix_koin_count integer not null,
    required_votes integer not null,
    unique(type)
);

create table kort.fix (
    fix_id integer primary key default nextval('kort.fix_id'),
    user_id integer,
    create_date timestamp not null default now(),
    error_id integer not null,
    schema character varying(50) not null,
    osm_id integer not null,
    message text,
    falsepositive boolean not null default false,
    complete boolean not null default false,
    valid boolean,
    in_osm boolean not null default false,
    constraint complete_validity CHECK ((complete and valid is not null) or not complete),
    constraint only_one_pending_per_error CHECK (check_fix_onlyone_pending_per_error(error_id, schema, osm_id)
);

create table kort.user (
    user_id integer primary key default nextval('kort.user_id'),
    name varchar(100) not null,
    username varchar(100),
    koin_count integer not null default 0 check (koin_count >= 0),
    token varchar(255),
    oauth_provider varchar(100),
    oauth_user_id varchar(100),
    secret varchar(100) unique,
    unique(oauth_provider, oauth_user_id)
);

create table kort.badge (
    badge_id integer primary key,
    name varchar(100) not null,
    title varchar(100) not null,
    compare_value integer,
    description varchar(500) not null,
    color varchar(10) not null,
    sorting integer not null
);

create table kort.user_badge (
    user_id integer,
    badge_id integer,
    create_date timestamp not null,
    primary key (user_id, badge_id),
    foreign key (badge_id) references kort.badge (badge_id),
    foreign key (user_id) references kort.user (user_id)
);

create table kort.answer (
    answer_id integer primary key,
    type varchar(100),
    value varchar(100) unique not null,
    title varchar(100) not null,
    sorting integer not null,
    foreign key (type) references kort.error_type (type)
);

create table kort.vote (
    vote_id integer primary key default nextval('kort.vote_id'),
    user_id integer,
    fix_id integer,
    valid boolean,
    create_date timestamp not null default now(),
    unique(user_id, fix_id),
    foreign key (user_id) references kort.user (user_id),
    foreign key (fix_id) references kort.fix (fix_id)
);
