-- delete all records that are not in Switzerland
delete from keepright.errors where schema not in ('95','96');

-- maybe we need to delete 'missing tags' error from nodes (ways are more interessting)

reindex table keepright.errors;


-- translate description

-- replace text in description
update keepright.errors set msgid = replace(replace(replace(replace(replace(msgid, '$1', txt1), '$2', txt2), '$3', txt3), '$4', txt4), '$5', txt5);


-- fill data in table error_type
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (90, 'motorway_ref', 'Autobahn ohne Bezeichner', 'text','Bezeichner');
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (100, 'religion', 'Kultst?tte/Kirche ohne Religion', 'select', 'Religion');
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (110, 'poi_name', 'Objekt ohne Namen', 'text', 'Name');
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (180, 'relation_type', 'Beziehung ohne Typ', 'select', 'Typ');
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (300, 'missing_maxspeed', 'Fehlendes Tempolimit', 'number', 'Tempolimit');
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (360, 'language_unknown', 'Sprache unbekannt', 'select', 'Sprache');
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (390, 'missing_track_type', 'Strassentyp unbekannt', 'select', 'Typ');
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder) values (71, 'way_wo_tags', 'Strasse ohne Namen', 'text', 'Strassenname');

ALTER TABLE keepright.errors DROP COLUMN error_name;
