create sequence kort.fix_id;
create sequence kort.validation_id;
create sequence kort.user_id;

create table kort.error_type (
    error_type_id integer primary key,
    type character varying(20) not null,
    description character varying(255),
    view_type character varying(50),
    answer_placeholder character varying(100),
    vote_question character varying(255),
    vote_koin_count integer not null,
    fix_koin_count integer not null,
    required_validations integer not null,
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
    complete boolean default false,
    unique(user_id, error_id, schema, osm_id),
    foreign key (error_id, schema, osm_id) references keepright.errors (error_id, schema, object_id)
);

create table kort.user (
    user_id integer primary key default nextval('kort.user_id'),
    name varchar(100) not null,
    username varchar(100),
    koin_count integer not null default 0,
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

create table kort.validation (
    validation_id integer primary key default nextval('kort.validation_id'),
    user_id integer,
    fix_id integer,
    valid boolean,
    create_date timestamp not null default now(),
    unique(user_id, fix_id),
    foreign key (user_id) references kort.user (user_id),
    foreign key (fix_id) references kort.fix (fix_id)
);

