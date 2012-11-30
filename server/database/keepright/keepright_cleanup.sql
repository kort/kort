-- reduce amount of data
delete from keepright.errors where schema::numeric < 80;

vacuum full keepright.errors; 
reindex database osm_bugs;

-- translate description

-- replace text in description
-- update keepright.errors set msgid = replace(replace(replace(replace(replace(msgid, '$1', txt1), '$2', txt2), '$3', txt3), '$4', txt4), '$5', txt5);


-- fill data in table error_type
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (90, 'motorway_ref', 'Autobahn ohne Bezeichner', 'text', 'Bezeichner', 'Ist diese Bezeichnung korrekt?', 10, 3);
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (100, 'religion', 'Kultstätte/Kirche ohne Religion', 'select', 'Religion', 'Ist diese Kultstätte/Kirche von dieser Religion?', 15, 3);
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (110, 'poi_name', 'Objekt ohne Namen', 'text', 'Name', 'Passt der Name zum gegebenen Objekt?', 15, 3);
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (180, 'relation_type', 'Beziehung ohne Typ', 'select', 'Typ', 'Ist dieser Typ korrekt?', 15, 2);
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (300, 'missing_maxspeed', 'Fehlendes Tempolimit', 'number', 'Tempolimit', 'Darf man auf dieser Strasse mit dieser Geschwindigkeit fahren?', 10, 3);
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (360, 'language_unknown', 'Sprache des Namens unbekannt', 'select', 'Sprache', 'Ist der Name in folgender Sprache?', 5, 3);
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (390, 'missing_track_type', 'Typ des Wegs unbekannt', 'select', 'Typ', 'Ist der Weg folgendermassen beschaffen?', 5, 5);
insert into keepright.error_type (error_type_id, type, description, view_type, answer_placeholder, vote_question, koin_count, required_validations) values (71, 'way_wo_tags', 'Strasse ohne Namen', 'text', 'Strassenname', 'Ist dieser Strassenname korrekt?', 15, 3);

ALTER TABLE keepright.errors DROP COLUMN error_name;
