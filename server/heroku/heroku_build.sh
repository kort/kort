#!/bin/bash
if [ -z $BUILD_DIR -a -z $CI_HOME ] ; then
   echo "You need to specify the BUILD_DIR and CI_HOME environment variable."
   exit 1
fi

mkdir $BUILD_DIR
mkdir -p $BUILD_DIR/lib/Leaflet-0.4.5
mkdir -p $BUILD_DIR/lib/Slim-2.1.0
mkdir -p $BUILD_DIR/lib/google-api-php-client
mkdir -p $BUILD_DIR/server

cp $CI_HOME/index.* $BUILD_DIR
cp $CI_HOME/app.* $BUILD_DIR/
cp -r $CI_HOME/app $BUILD_DIR/
cp -r $CI_HOME/resources $BUILD_DIR/
cp -r $CI_HOME/touch $BUILD_DIR/
cp -r $CI_HOME/ux $BUILD_DIR/
cp -r $CI_HOME/i18n $BUILD_DIR
cp -r $CI_HOME/test $BUILD_DIR

cp -r $CI_HOME/lib/Leaflet-0.4.5/dist/ $BUILD_DIR/lib/Leaflet-0.4.5/
cp -r $CI_HOME/lib/Slim-2.1.0/Slim/ $BUILD_DIR/lib/Slim-2.1.0/
cp -r $CI_HOME/lib/google-api-php-client/src $BUILD_DIR/lib/google-api-php-client/
cp -r $CI_HOME/lib/qunit $BUILD_DIR/lib
cp -r $CI_HOME/lib/simpletest $BUILD_DIR/lib

cp -r $CI_HOME/server/php/ $BUILD_DIR/server/
cp -r $CI_HOME/server/webservices/ $BUILD_DIR/server/
cp -r $CI_HOME/server/oauth2callback/ $BUILD_DIR/server/
