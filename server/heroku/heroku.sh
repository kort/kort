#!/bin/bash
if [[ $DEPLOY == "true" ]] ; then
    if [ -z $BUILD_DIR -a -z $CI_HOME ] ; then
       echo "You need to specify the BUILD_DIR and CI_HOME environment variable."
       exit 1
    fi
    yes | ruby $CI_HOME/server/heroku/heroku_prepare.rb
    bash $CI_HOME/server/heroku/heroku_keys.sh
    bash $CI_HOME/server/heroku/heroku_build.sh
    cd $BUILD_DIR
    bash $CI_HOME/server/heroku/heroku_add.sh >/dev/null
    bash $CI_HOME/server/heroku/heroku_push.sh
else
    echo "Omitting deployment to heroku."
fi
