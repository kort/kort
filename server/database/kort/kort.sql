create sequence kort.fix_id;
create sequence kort.validation_id;
create sequence kort.user_id;

create table kort.error_type (
    error_type_id integer not null,
    type character varying(20) not null,
    description character varying(255),
    view_type character varying(50),
    answer_placeholder character varying(100),
    vote_question character varying(255),
    vote_koin_count integer not null,
    fix_koin_count integer not null,
    required_validations integer not null,
    PRIMARY KEY (error_type_id)
);


create table kort.fix (
    fix_id integer primary key default nextval('kort.fix_id'),
    user_id integer,
    create_date timestamp not null default now(),
    error_id integer not null,
    message text,
    complete boolean default false
);

create table kort.user (
    user_id integer primary key default nextval('kort.user_id'),
    name varchar(100) not null,
    username varchar(100),
    koin_count integer not null default 0,
    token varchar(255),
    oauth_provider varchar(100),
    oauth_user_id varchar(100),
    secret varchar(100)
);

create table kort.badge (
    badge_id integer primary key,
    name varchar(100) not null,
    title varchar(100) not null,
    description varchar(500) not null,
    color varchar(10) not null,
    sorting integer not null
);

create table kort.user_badge (
    user_id integer,
    badge_id integer,
    create_date timestamp not null,
    primary key (user_id, badge_id)
);

create table kort.answer (
    answer_id integer primary key,
    type varchar(100),
    value varchar(100) unique not null,
    title varchar(100) not null,
    sorting integer not null
);

create table kort.validation (
    validation_id integer primary key default nextval('kort.validation_id'),
    user_id integer,
    fix_id integer,
    valid boolean,
    create_date timestamp not null default now()
);

