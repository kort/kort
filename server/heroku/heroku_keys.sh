#!/bin/bash
if [ -z $CI_HOME ] ; then
   echo "You need to specify the CI_HOME environment variable."
   exit 1
fi

heroku keys:clear
cp $CI_HOME/server/ssh_pub_keys/id_rsa_odi.pub $HOME/.ssh/id_rsa.pub
yes | heroku keys:add
