#!/bin/bash
echo "kort" | heroku apps:destroy kort
heroku apps:create kort

git push -f heroku master
