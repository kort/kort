drop schema kort cascade;
create schema kort;

create table kort.fix (
    fix_id integer primary key,
    create_date timestamp not null,
    error_id integer not null,
    message text
);

create sequence kort.fix_id;

create table kort.user (
    user_id integer primary key,
    name varchar(100) not null,
    username varchar(100),
    email varchar(100),
    token varchar(255),
    koin_count integer not null
);

create table kort.badge (
    bagde_id integer primary key,
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

