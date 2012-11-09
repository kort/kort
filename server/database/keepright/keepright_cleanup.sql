-- delete all records that are not in Switzerland
delete from keepright.errors where schema not in ('95','96');

-- maybe we need to delete 'missing tags' error from nodes (ways are more interessting)

reindex table keepright.errors;


-- translate description

-- replace text in description
update keepright.errors set msgid = replace(replace(replace(replace(replace(msgid, '$1', txt1), '$2', txt2), '$3', txt3), '$4', txt4), '$5', txt5);


-- fill data in table error_type
insert into keepright.error_type (error_type_id, type, description) values (90, 'motorway_ref', 'motorways without ref');
insert into keepright.error_type (error_type_id, type, description) values (100, 'religion', 'places of worship without religion');
insert into keepright.error_type (error_type_id, type, description) values (110, 'poi_name', 'point of interest without name');
insert into keepright.error_type (error_type_id, type, description) values (180, 'relation_type', 'relations without type');
insert into keepright.error_type (error_type_id, type, description) values (300, 'missing_maxspeed', 'missing maxspeed');
insert into keepright.error_type (error_type_id, type, description) values (360, 'language_unknown', 'language unknown');
insert into keepright.error_type (error_type_id, type, description) values (390, 'missing_track_type', 'missing tracktype');

ALTER TABLE keepright.errors DROP COLUMN error_name;
