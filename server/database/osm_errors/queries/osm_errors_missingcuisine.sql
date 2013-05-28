INSERT INTO osm_errors.errors (error_id, schema, error_type_id, error_name, object_id, object_type, msgid, lat, lon, geom, txt1)
SELECT osmq.osm_id, 1001, 1001, 'missing cuisine', osmq.osm_id, osmq.osm_type, 'Error from EOSMDBOne', osmq.lat, osmq.lon, osmq.geom, osmq.txt1
FROM osm_errors.dblink('dbname=gis_db port=8080 host=152.96.80.44 user=readonly',
     'SELECT CASE gtype=''pt'' WHEN TRUE THEN ''node'' ELSE ''way'' END AS osm_type, ceiling(ST_Y(ST_Transform(ST_Centroid(way),4326))::numeric * 10000000) AS lat, ceiling(ST_X(ST_Transform(ST_Centroid(way),4326))::numeric * 10000000) AS lon, ST_Transform(ST_Centroid(way),4326) AS geom, osm_id, name AS txt1
			FROM osm_poi
			WHERE
			osm_id>0
			AND tags @> hstore(''amenity'', ''restaurant'')
			AND (hstore("tags")->''cuisine'') IS NULL
			AND (hstore("tags")->''name'') IS NOT NULL

			LIMIT 10000') AS osmq(osm_type keepright.osm_type,lat integer,lon integer,geom public.geometry(Point,4326), osm_id int8, txt1 text)