#!/bin/bash
if [ -z $BUILD_DIR -a -z $SOURCE_DIR -a -z $TARGET_ENV ] ; then
   echo "You need to specify the BUILD_DIR, SOURCE_DIR and TARGET_ENV environment variable."
   exit 1
fi

mkdir $BUILD_DIR

if [[ $TARGET_ENV == "prod" ]] ; then
    echo "Production build... copying files from $SOURCE_DIR to $BUILD_DIR"
    cp -r $SOURCE_DIR/build/Kort/production/* $BUILD_DIR
    cp -r $SOURCE_DIR/docs $BUILD_DIR
else
    echo "Development build... copying files from $SOURCE_DIR to $BUILD_DIR"
    mkdir -p $BUILD_DIR/lib/Leaflet-0.4.5
    mkdir -p $BUILD_DIR/lib/Slim-2.1.0
    mkdir -p $BUILD_DIR/lib/google-api-php-client
    mkdir -p $BUILD_DIR/lib/oauth-php
    mkdir -p $BUILD_DIR/server

    cp $SOURCE_DIR/index*.* $BUILD_DIR
    cp $SOURCE_DIR/app.* $BUILD_DIR/
    cp -r $SOURCE_DIR/app $BUILD_DIR/
    cp -r $SOURCE_DIR/docs $BUILD_DIR
    cp -r $SOURCE_DIR/resources $BUILD_DIR/
    cp -r $SOURCE_DIR/touch $BUILD_DIR/
    cp -r $SOURCE_DIR/ux $BUILD_DIR/
    cp -r $SOURCE_DIR/i18n $BUILD_DIR
    cp -r $SOURCE_DIR/test $BUILD_DIR
    cp -r $SOURCE_DIR/patch $BUILD_DIR
    cp -r $SOURCE_DIR/vendor $BUILD_DIR
    cp -r $SOURCE_DIR/proposals $BUILD_DIR

    cp -r $SOURCE_DIR/lib/Leaflet-0.4.5/dist/ $BUILD_DIR/lib/Leaflet-0.4.5/
    cp -r $SOURCE_DIR/lib/Slim-2.1.0/Slim/ $BUILD_DIR/lib/Slim-2.1.0/
    cp -r $SOURCE_DIR/lib/google-api-php-client/src $BUILD_DIR/lib/google-api-php-client/
    cp -r $SOURCE_DIR/lib/oauth-php/library $BUILD_DIR/lib/oauth-php/
    cp -r $SOURCE_DIR/lib/kort-libs $BUILD_DIR/lib
    cp -r $SOURCE_DIR/lib/qunit $BUILD_DIR/lib
    cp -r $SOURCE_DIR/lib/simpletest $BUILD_DIR/lib
    cp -r $SOURCE_DIR/lib/zocial $BUILD_DIR/lib
    cp -r $SOURCE_DIR/lib/jquery-1.8.3 $BUILD_DIR/lib

    cp -r $SOURCE_DIR/server/php/ $BUILD_DIR/server/
    cp -r $SOURCE_DIR/server/webservices/ $BUILD_DIR/server/
    cp -r $SOURCE_DIR/server/oauth2callback/ $BUILD_DIR/server/
fi
