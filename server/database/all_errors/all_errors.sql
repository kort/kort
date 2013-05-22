create table all_errors.errors (
	  source varchar(20) not null,
    error_id bigint not null,
    schema varchar(6) not null,
    error_type_id integer not null,
    osm_id bigint not null, 
    osm_type keepright.osm_type not null,
    description text,                          
    latitude integer not null,
    longitude integer not null,
    geom public.geometry(Point,4326) not null,
    txt1 text,
    txt2 text,                   	
    txt3 text,
    txt4 text,
    txt5 text,
	  PRIMARY KEY(schema, error_id, osm_id)
);