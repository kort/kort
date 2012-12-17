#!/bin/bash
if [ -z $TARGET_ENV ] ; then
    echo "You need to specify the TARGET_ENV environment variable."
    exit 1
fi

APP_NAME="kort"
if [[ $TARGET_ENV == "dev" ]] ; then
    APP_NAME="kort-dev"
fi

if [[ ${TRAVIS_PHP_VERSION:0:3} != "5.4" ]] ; then
    APP_NAME="$APP_NAME"`echo ${TRAVIS_PHP_VERSION:0:3} | tr '.' '-'`
fi

echo $APP_NAME | heroku apps:destroy $APP_NAME
heroku apps:create $APP_NAME

git push -f heroku master
