drop schema kort cascade;
create schema kort;

create table kort.fix (
    id integer primary key,
    create_date timestamp not null,
    error_id integer not null,
    message text
);

create sequence kort.fix_id;

create table kort.user (
    id integer primary key,
    name varchar(100) not null,
    username varchar(100),
    email varchar(100),
    token varchar(255),
    koins integer not null
);

create table kort.badge (
    id integer primary key,
    name varchar(100) not null,
    description varchar(500) not null,
    sorting integer not null
);

create table kort.user_badge (
    user_id integer,
    badge_id integer,
    create_date timestamp not null,
    primary key (user_id, badge_id)
);

create table kort.tracktype (
    id integer primary key,
    type_key varchar(100) unique not null,
    title varchar(100) not null,
    sorting integer not null
);