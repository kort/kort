-- Insert badge
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (1, 'highscore_place_1', '1. Rang', 'Erster Rang in der Highscore erreicht.', '#FFFBCB', 110);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (2, 'highscore_place_2', '2. Rang', 'Zweiter Rang in der Highscore erreicht.', '#d9d9d9', 120);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (3, 'highscore_place_3', '3. Rang', 'Dritter Rang in der Highscore erreicht.', '#d8c69a', 130);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (4, 'fix_count_100', '100 Aufträge', '100 Aufträge erledigt.', '#FFFBCB', 210);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (5, 'fix_count_50', '50 Aufträge', '50 Aufträge erledigt.', '#d9d9d9', 220);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (6, 'fix_count_10', '10 Aufträge', '10 Aufträge erledigt.', '#d8c69a', 230);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (7, 'vote_count_1000', '1000 Prüfungen', '1000 Antworten geprüft.', '#FFFBCB', 310);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (8, 'vote_count_100', '100 Prüfungen', '100 Antworten geprüft.', '#d9d9d9', 320);
insert into kort.badge (badge_id, name, title, description, color, sorting) VALUES (9, 'vote_count_10', '10 Prüfungen', '10 Antworten geprüft.', '#d8c69a', 330);

-- Insert missing_track_types
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1, 'missing_track_type', 'grade1', 'Asphalt, Beton oder Pflastersteine', 110);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (2, 'missing_track_type', 'grade2', 'Schotter', 120);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (3, 'missing_track_type', 'grade3', 'Feinschotter-, Sand- oder Erdweg', 130);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (4, 'missing_track_type', 'grade4', 'Weg mit Pflanzenwuchs entlang der Spurmitte', 140);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (5, 'missing_track_type', 'grade5', 'Unbefestigter Weg', 150);

-- Insert religion
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (10, 'religion', 'buddhist','Buddhismus (Tempel)' , 110);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (11, 'religion', 'christian', 'Christentum (Kirche)', 120);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (12, 'religion', 'hindu', 'Hinduismus (Tempel)', 130);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (13, 'religion', 'jewish', 'Judentum (Synagoge)', 140);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (14, 'religion', 'multifaith', 'Mehrere Religionen', 150);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (15, 'religion', 'muslim', 'Islam (Moschee)', 160);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (16, 'religion', 'pastafarian', 'Pastafarianismus', 170);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (17, 'religion', 'shinto', 'Shinto (Schrein)', 180);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (18, 'religion', 'sikh', 'Sikh (Gurdwara)', 190);

-- Insert language_unknown
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (106, 'language_unknown', 'ar', 'Arabisch', 70);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (129, 'language_unknown', 'zh', 'Chinesisch', 300);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (134, 'language_unknown', 'hr', 'Kroatisch', 350);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (135, 'language_unknown', 'cs', 'Tschechisch', 360);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (136, 'language_unknown', 'da', 'Dänisch', 370);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (138, 'language_unknown', 'nl', 'Holländisch', 390);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (140, 'language_unknown', 'en', 'Englisch', 410);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (141, 'language_unknown', 'eo', 'Esperanto', 420);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (142, 'language_unknown', 'et', 'Estnisch', 430);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (147, 'language_unknown', 'fr', 'Französisch', 480);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (151, 'language_unknown', 'de', 'Deutsch', 500);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (152, 'language_unknown', 'el', 'Griechisch', 530);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (157, 'language_unknown', 'he', 'Hebräisch', 580);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (165, 'language_unknown', 'ga', 'Irisch', 660);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (169, 'language_unknown', 'is', 'Isländisch', 700);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (170, 'language_unknown', 'it', 'Italienisch', 710);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (172, 'language_unknown', 'ja', 'Japanisch', 730);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (185, 'language_unknown', 'ko', 'Koreanisch', 860);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (188, 'language_unknown', 'la', 'Lateinisch', 890);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (189, 'language_unknown', 'lb', 'Luxemburgisch', 900);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (209, 'language_unknown', 'nb', 'Norwegisch (Bokmål)', 1139);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (213, 'language_unknown', 'nn', 'Norwegisch (Nynorsk)', 1140);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (214, 'language_unknown', 'no', 'Norwegisch', 1150);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (225, 'language_unknown', 'fa', 'Persisch', 1260);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (226, 'language_unknown', 'pl', 'Polnisch', 1270);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (228, 'language_unknown', 'pt', 'Portugiesisch', 1290);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (230, 'language_unknown', 'rm', 'Rätoromanisch', 1310);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (232, 'language_unknown', 'ro', 'Rumänisch', 1330);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (233, 'language_unknown', 'ru', 'Russisch', 1340);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (235, 'language_unknown', 'sc', 'Sardisch', 1360);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (240, 'language_unknown', 'sr', 'Serbisch', 1410);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (241, 'language_unknown', 'gd', 'Schottisch-Gälisch', 1420);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (244, 'language_unknown', 'sk', 'Slowakisch', 1450);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (245, 'language_unknown', 'sl', 'Slowenisch', 1460);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (248, 'language_unknown', 'es', 'Spanisch', 1490);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (252, 'language_unknown', 'sv', 'Schwedisch', 1530);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (256, 'language_unknown', 'th', 'Thailändisch', 1570);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (258, 'language_unknown', 'bo', 'Tibetisch', 1590);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (263, 'language_unknown', 'tr', 'Türkisch', 1640);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (271, 'language_unknown', 'uz', 'Uzbekisch', 1720);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (273, 'language_unknown', 'vi', 'Vietnamesisch', 1740);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (276, 'language_unknown', 'cy', 'Walisisch', 1770);