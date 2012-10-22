create schema kort;

create table kort.fix (
    id integer primary key,
    error_id integer not null,
    message text
);

create sequence serial;