-- Insert badges
insert into kort.badge (id, name, description, sorting) VALUES (1, 'highscore_place_1', 'Erster Rang in der Highscore erreicht', 110);
insert into kort.badge (id, name, description, sorting) VALUES (2, 'highscore_place_2', 'Zweiter Rang in der Highscore erreicht', 120);
insert into kort.badge (id, name, description, sorting) VALUES (3, 'highscore_place_3', 'Dritter Rang in der Highscore erreicht', 130);
insert into kort.badge (id, name, description, sorting) VALUES (4, 'fix_count_100', '100 Aufträge erledigt', 210);
insert into kort.badge (id, name, description, sorting) VALUES (5, 'fix_count_50', '50 Aufträge erledigt', 220);
insert into kort.badge (id, name, description, sorting) VALUES (6, 'fix_count_10', '10 Aufträge erledigt', 230);
insert into kort.badge (id, name, description, sorting) VALUES (7, 'verification_count_1000', '1000 Verifikationen getätigt', 310);
insert into kort.badge (id, name, description, sorting) VALUES (8, 'verification_count_100', '100 Verifikationen getätigt', 320);
insert into kort.badge (id, name, description, sorting) VALUES (9, 'verification_count_10', '10 Verifikationen getätigt', 330);
insert into kort.badge (id, name, description, sorting) VALUES (10, 'diligent_fix_10_24', '10 Aufträge in 24h', 410);
insert into kort.badge (id, name, description, sorting) VALUES (11, 'diligent_verification_10_24', '10 Verifikationen in 24h', 420);
insert into kort.badge (id, name, description, sorting) VALUES (12, 'bugtype_motorway_ref', 'Einen Auftrag vom Typ Strassenbezeichner erledigt', 510);
insert into kort.badge (id, name, description, sorting) VALUES (13, 'bugtype_religion', 'Einen Auftrag vom Typ Religion erledigt', 520);
insert into kort.badge (id, name, description, sorting) VALUES (14, 'bugtype_poi_name', 'Einen Auftrag vom Typ POI ohne Namen erledigt', 530);
insert into kort.badge (id, name, description, sorting) VALUES (15, 'bugtype_relation_type', 'Einen Auftrag vom Typ Relation ohne Typ erledigt', 540);
insert into kort.badge (id, name, description, sorting) VALUES (16, 'bugtype_missing_maxspeed', 'Einen Auftrag vom Typ fehlendes Geschwindikeitslimit erledigt', 550);
insert into kort.badge (id, name, description, sorting) VALUES (17, 'bugtype_language_unknown', 'Einen Auftrag vom Typ unbekannte Sprache erledigt', 560);
insert into kort.badge (id, name, description, sorting) VALUES (18, 'bugtype_missing_track_type', 'Einen Auftrag vom Typ Strassentyp erledigt', 570);

-- Insert tracktypes
insert into kort.tracktype (id, type_key, title, sorting) VALUES (1, 'grade1', 'Asphalt, Beton oder Pflastersteine', 110);
insert into kort.tracktype (id, type_key, title, sorting) VALUES (2, 'grade2', 'Schotter', 120);
insert into kort.tracktype (id, type_key, title, sorting) VALUES (3, 'grade3', 'Feinschotter-, Sand- oder Erdweg', 130);
insert into kort.tracktype (id, type_key, title, sorting) VALUES (4, 'grade4', 'Weg mit Pflanzenwuchs entlang der Spurmitte', 140);
insert into kort.tracktype (id, type_key, title, sorting) VALUES (5, 'grade5', 'Unbefestigter Weg', 150);