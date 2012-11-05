#!/bin/bash
if [ -z $BUILD_DIR -a -z $CI_HOME ] ; then
   echo "You need to specify the BUILD_DIR and CI_HOME environment variable."
   exit 1
fi

if [ $DEPLOY ] ; then
    yes | ruby $CI_HOME/server/travis_deployer.rb
    bash $CI_HOME/server/heroku/heroku_keys.sh
    bash $CI_HOME/server/heroku/heroku_build.sh
    cd $BUILD_DIR
    bash $CI_HOME/server/heroku/heroku_add.sh >/dev/null
    bash $CI_HOME/server/heroku/heroku_push.sh
else
    echo "Omitting deployment to heroku."
fi
