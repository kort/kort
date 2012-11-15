#!/bin/bash
if [ -z $TARGET_ENV ] ; then
    echo "You need to specify the TARGET_ENV environment variable."
    exit 1
fi

APP_NAME="kort"
if [[ $TARGET_ENV == "dev" ]] ; then
    APP_NAME="kort-dev"
fi

echo $APP_NAME | heroku apps:destroy $APP_NAME
heroku apps:create $APP_NAME

git push -f heroku master
