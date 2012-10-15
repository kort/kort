#!/bin/bash
heroku apps:destroy kort
heroku apps:create kort
git push -f heroku travis:master
