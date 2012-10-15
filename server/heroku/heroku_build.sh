#!/bin/bash
mkdir build-heroku
mkdir build-heroku/lib

cp index.* build-heroku/
cp app.* build-heroku/
cp -r app build-heroku/
cp -r resources build-heroku/
cp -r touch build-heroku/
cp -r ux build-heroku/
cp -r i18n build-heroku

cp -r lib/Leaflet-0.4.4/ build-heroku/lib/

mv build-heroku ../
