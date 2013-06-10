create type keepright.state as enum('new','reopened','ignore_temporarily','ignore');

create type keepright.osm_type as enum('node','way','relation');

create table keepright.errors (
    schema varchar(6) not null default '',
    error_id integer not null,
    error_type_id integer not null,
    error_name varchar(100) not null,
    object_type keepright.osm_type not null,
    object_id bigint not null,
    state keepright.state not null,
    first_occurrence timestamp not null,
    last_checked timestamp not null,
    object_timestamp timestamp not null,
    user_name text not null,
    lat integer not null,
    lon integer not null,
    comment text,
    comment_timestamp timestamp,
    msgid text,
    txt1 text,
    txt2 text,
    txt3 text,
    txt4 text,
    txt5 text
);
