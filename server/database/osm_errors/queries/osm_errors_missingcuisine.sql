INSERT INTO osm_errors.errors (schema, error_type_id, error_name, object_id, object_type, msgid, lat, lon, geom, txt1)
SELECT 100, 400, 'missing cuisine', osmq.osm_id, 'way', 'Error from EOSMDBOne', osmq.lat, osmq.lon, osmq.geom, osmq.txt1
FROM osm_errors.dblink('dbname=gis_db port=8080 host=152.96.80.44 user=readonly',
     'SELECT ceiling(ST_X(ST_Centroid(way))::numeric * 100) AS lat, ceiling(ST_Y(ST_Centroid(way))::numeric * 100) AS lon, ST_Transform(ST_Centroid(way),4326) AS geom, osm_id, name AS txt1
			FROM osm_poi
			WHERE tags @> hstore(''amenity'', ''restaurant'')
			AND (hstore("tags")->''cuisine'') IS NULL
			AND (hstore("tags")->''name'') IS NOT NULL
			LIMIT 10000') AS osmq(lat integer,lon integer,geom public.geometry(Point,4326), osm_id int8, txt1 text)