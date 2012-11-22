#!/bin/bash
if [[ $DEPLOY == "true" ]] ; then
    if [ -z $BUILD_DIR -a -z $CI_HOME -a -z $TARGET_ENV ] ; then
       echo "You need to specify the BUILD_DIR, CI_HOME, TARGET_ENV environment variable."
       exit 1
    fi
    
    export SOURCE_DIR=$CI_HOME
    if [[ $TARGET_ENV == "prod" ]] ; then
        SOURCE_DIR="$CI_HOME/build/Kort/testing"
    fi

    yes | ruby $CI_HOME/server/heroku/heroku_prepare.rb
    bash $CI_HOME/server/heroku/heroku_keys.sh
    bash $CI_HOME/server/heroku/heroku_build.sh
    cd $BUILD_DIR
    bash $CI_HOME/server/heroku/heroku_add.sh >/dev/null
    bash $CI_HOME/server/heroku/heroku_push.sh
    heroku config:add KORT_DB_API_KEY=$KORT_DB_API_KEY
else
    echo "Omitting deployment to heroku."
fi
