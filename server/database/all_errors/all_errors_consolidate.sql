INSERT INTO all_errors.errors (source,error_id,schema,error_type_id,osm_id,osm_type,description,latitude,longitude,geom,txt1,txt2,txt3,txt4,txt5)
SELECT DISTINCT 'keepright' AS source, error_id, schema, error_type_id,object_id AS osm_id, object_type AS osm_type, msgid AS description, lat AS latitude, lon AS longitude, geom, txt1, txt2, txt3, txt4, txt5
FROM keepright.errors
WHERE ((state = ANY (ARRAY['new'::keepright.state, 'reopened'::keepright.state])) AND (object_id <> ALL (ARRAY[(1611867263)::bigint, (1723313154)::bigint, (111841602)::bigint])))
UNION ALL
SELECT 'osm_errors' AS source, error_id, schema, error_type_id,object_id AS osm_id, object_type AS osm_type, msgid AS description, lat AS latitude, lon AS longitude, geom, txt1, txt2, txt3, txt4, txt5
FROM osm_errors.errors;