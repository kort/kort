#!/bin/bash
echo "kort" | heroku apps:destroy kort
heroku apps:create kort
heroku sharing:add juerg.hunziker@gmail.com

git push -f heroku master
