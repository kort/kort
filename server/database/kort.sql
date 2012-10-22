drop schema kort cascade;
create schema kort;

create table kort.fix (
    id integer primary key,
    create_date timestamp not null,
    error_id integer not null,
    message text
);

create sequence kort.fix_id;