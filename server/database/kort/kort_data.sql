-- fill data in table error_type
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (90, 'motorway_ref', 'error_type.title.motorway_ref', 'ref', 'text', 'error_type.placeholder.ref', 'vote.question.ref', 'bug.question.motorway_ref', 10, 5, 3);
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (100, 'religion', 'error_type.title.worship_religion', 'religion', 'select', 'error_type.placeholder.religion', 'vote.question.place_of_worship', 'bug.question.place_of_worship', 15, 5, 3);
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (110, 'poi_name', 'error_type.title.poi_wo_name', 'name', 'text', 'error_type.placeholder.name', 'vote.question.name', 'bug.question.poi', 15, 5, 3);
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (300, 'missing_maxspeed', 'error_type.title.missing_speedlimit', 'maxspeed', 'number', 'error_type.placeholder.speed_limit', 'vote.question.maxspeed', 'bug.question.speed', 10, 5, 3);
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (360, 'language_unknown', 'error_type.title.language_name', 'name:XX', 'select', 'error_type.placeholder.language', 'vote.question.language_unknown', 'bug.question.language', 5, 5, 3);
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (390, 'missing_track_type', 'error_type.title.tracktype', 'tracktype', 'select', 'error_type.placeholder.type', 'vote.question.tracktype', 'bug.question.track', 5, 5, 3);
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (71, 'way_wo_tags', 'error_type.title.street_wo_name', 'name', 'text', 'error_type.placeholder.street_name', 'vote.question.street_name', 'bug.question.name_of_street', 15, 5, 3);
insert into kort.error_type (error_type_id, type, description, osm_tag, view_type, answer_placeholder, vote_question, bug_question, fix_koin_count, vote_koin_count, required_votes) values (1001, 'missing_cuisine', 'error_type.title.missing_cuisine', 'cuisine', 'select', 'error_type.placeholder.missing_cuisine', 'vote.question.missing_cuisine', 'bug.question.cuisine_of_restaurant', 15, 5, 3);
-- Insert badge
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (1, 'highscore_place_1', 'badge.name.first_place', 'badge.description.reached_1st_place', '#FFFBCB', 110, null);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (2, 'highscore_place_2', 'badge.name.second_place', 'badge.description.reached_2nd_place', '#d9d9d9', 120, null);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (3, 'highscore_place_3', 'badge.name.third_place', 'badge.description.reached_3rd_place', '#d8c69a', 130, null);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (4, 'fix_count_100', 'badge.name.100_missions', 'badge.description.100_missions_completed', '#FFFBCB', 210, 100);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (5, 'fix_count_50', 'badge.name.50_missions', 'badge.description.50_missions_completed', '#d9d9d9', 220, 50);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (6, 'fix_count_10', 'badge.name.10_missions', 'badge.description.10_missions_completed', '#d8c69a', 230, 10);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (7, 'vote_count_1000', 'badge.name.1000_checks', 'badge.description.1000_checks', '#FFFBCB', 310, 1000);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (8, 'vote_count_100', 'badge.name.100_checks', 'badge.description.100_checks', '#d9d9d9', 320, 100);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (9, 'vote_count_10', 'badge.name.10_checks', 'badge.description.10_checks', '#d8c69a', 330, 10);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (10, 'fix_count_1', 'badge.name.first_mission', 'badge.description.1st_mission', '#CFFFD2', 410, 1);
insert into kort.badge (badge_id, name, title, description, color, sorting, compare_value) VALUES (11, 'vote_count_1', 'badge.name.first_check', 'badge.description.1st_check', '#CFFFD2', 420, 1);

-- Insert missing_track_types
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1, 'missing_track_type', 'grade1', 'answer.track_type.grade1', 110);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (2, 'missing_track_type', 'grade2', 'answer.track_type.grade2', 120);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (3, 'missing_track_type', 'grade3', 'answer.track_type.grade3', 130);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (4, 'missing_track_type', 'grade4', 'answer.track_type.grade4', 140);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (5, 'missing_track_type', 'grade5', 'answer.track_type.grade5', 150);

-- Insert religion
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (10, 'religion', 'buddhist','answer.religion.buddhist' , 110);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (11, 'religion', 'christian', 'answer.religion.christian', 120);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (12, 'religion', 'hindu', 'answer.religion.hindu', 130);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (13, 'religion', 'jewish', 'answer.religion.jewish', 140);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (15, 'religion', 'muslim', 'answer.religion.muslim', 160);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (16, 'religion', 'pastafarian', 'answer.religion.pastafari', 170);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (17, 'religion', 'shinto', 'answer.religion.shinto', 180);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (18, 'religion', 'sikh', 'answer.religion.sikh', 190);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (14, 'religion', 'multifaith', 'answer.religion.multiple', 200);

-- Insert language_unknown
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (151, 'language_unknown', 'de', 'answer.language.german', 10);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (140, 'language_unknown', 'en', 'answer.language.english', 20);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (147, 'language_unknown', 'fr', 'answer.language.french', 30);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (170, 'language_unknown', 'it', 'answer.language.italian', 40);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (248, 'language_unknown', 'es', 'answer.language.spanish', 50);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (106, 'language_unknown', 'ar', 'answer.language.arabic', 100);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (280, 'language_unknown', 'ca', 'answer.language.catalan', 200);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (129, 'language_unknown', 'zh', 'answer.language.chinese', 400);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (134, 'language_unknown', 'hr', 'answer.language.croatian', 400);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (135, 'language_unknown', 'cs', 'answer.language.czech', 500);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (136, 'language_unknown', 'da', 'answer.language.danish', 600);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (138, 'language_unknown', 'nl', 'answer.language.dutch', 700);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (142, 'language_unknown', 'et', 'answer.language.estonian', 800);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (141, 'language_unknown', 'fi', 'answer.language.finnish', 900);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (152, 'language_unknown', 'el', 'answer.language.greek', 1000);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (157, 'language_unknown', 'he', 'answer.language.hebrew', 1100);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (281, 'language_unknown', 'hu', 'answer.language.hungarian', 1150);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (165, 'language_unknown', 'ga', 'answer.language.irish', 1200);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (169, 'language_unknown', 'is', 'answer.language.icelandic', 1300);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (172, 'language_unknown', 'ja', 'answer.language.japanese', 1400);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (185, 'language_unknown', 'ko', 'answer.language.korean', 1500);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (188, 'language_unknown', 'la', 'answer.language.latin', 1600);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (189, 'language_unknown', 'lb', 'answer.language.luxembourgish', 1700);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (214, 'language_unknown', 'no', 'answer.language.norwegian', 1800);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (225, 'language_unknown', 'fa', 'answer.language.persian', 1900);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (226, 'language_unknown', 'pl', 'answer.language.polish', 2000);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (228, 'language_unknown', 'pt', 'answer.language.portuguese', 2100);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (230, 'language_unknown', 'rm', 'answer.language.romansh', 2200);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (232, 'language_unknown', 'ro', 'answer.language.romanian', 2300);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (233, 'language_unknown', 'ru', 'answer.language.russian', 2400);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (235, 'language_unknown', 'sc', 'answer.language.sardinian', 2500);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (241, 'language_unknown', 'gd', 'answer.language.scottish_gaelic', 2600);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (252, 'language_unknown', 'sv', 'answer.language.swedish', 2700);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (243, 'language_unknown','gsw', 'answer.language.swiss_german', 2800);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (240, 'language_unknown', 'sr', 'answer.language.serbian', 2900);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (244, 'language_unknown', 'sk', 'answer.language.slovakian', 3000);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (245, 'language_unknown', 'sl', 'answer.language.slovenian', 3100);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (256, 'language_unknown', 'th', 'answer.language.thai', 3200);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (263, 'language_unknown', 'tr', 'answer.language.turkish', 3300);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (268, 'language_unknown', 'uk', 'answer.language.ukrainian', 3350);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (273, 'language_unknown', 'vi', 'answer.language.vietnamese', 3400);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (276, 'language_unknown', 'cy', 'answer.language.welsh', 3500);

-- Insert cuisine
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1001, 'missing_cuisine', 'regional', 'answer.missing_cuisine.regional', 110);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1002, 'missing_cuisine', 'coffee_shop', 'answer.missing_cuisine.coffee_shop', 120);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1003, 'missing_cuisine', 'bistro_brasserie', 'answer.missing_cuisine.bistro_brasserie', 130);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1004, 'missing_cuisine', 'italian', 'answer.missing_cuisine.italian', 140);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1005, 'missing_cuisine', 'turkish', 'answer.missing_cuisine.turkish', 150);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1006, 'missing_cuisine', 'chinese', 'answer.missing_cuisine.chinese', 160);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1007, 'missing_cuisine', 'thai', 'answer.missing_cuisine.thai', 170);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1008, 'missing_cuisine', 'asian', 'answer.missing_cuisine.asian', 180);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1009, 'missing_cuisine', 'indian', 'answer.missing_cuisine.indian', 190);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1010, 'missing_cuisine', 'french', 'answer.missing_cuisine.french', 200);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1011, 'missing_cuisine', 'mexican', 'answer.missing_cuisine.mexican', 210);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1012, 'missing_cuisine', 'american', 'answer.missing_cuisine.american', 220);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1013, 'missing_cuisine', 'japanese', 'answer.missing_cuisine.japanese', 230);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1014, 'missing_cuisine', 'greek', 'answer.missing_cuisine.greek', 240);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1015, 'missing_cuisine', 'international', 'answer.missing_cuisine.international', 250);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1016, 'missing_cuisine', 'sandwich','answer.missing_cuisine.sandwich' , 260);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1017, 'missing_cuisine', 'chicken', 'answer.missing_cuisine.chicken', 270);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1018, 'missing_cuisine', 'seafood', 'answer.missing_cuisine.seafood', 280);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1019, 'missing_cuisine', 'burger', 'answer.missing_cuisine.burger', 290);
insert into kort.answer (answer_id, type, value, title, sorting) VALUES (1020, 'missing_cuisine', 'steak_house', 'answer.missing_cuisine.steak_house', 300);
