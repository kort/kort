#!/bin/bash
heroku keys:clear
yes | heroku keys:add
heroku keys:add server/ssh_pub_keys/id_ras_odi.pub
