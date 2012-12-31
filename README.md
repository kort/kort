# Kort

Kort is a cross-platform, crowdsourcing app aimed to improve OpenStreetMap.

## Build

Kort is built using [Travis CI](https://travis-ci.org):

[![Build Status](https://api.travis-ci.org/odi86/kort.png?branch=master)](http://travis-ci.org/odi86/kort)

The app is deployed on [Heroku](https://www.heroku.com/): http://play.kort.ch

## Abstract

This web app was developed by Stefan Oderbolz and Jürg Hunziker as part of their bachelor thesis.

The goal of the thesis was to create a cross-platform app to fix errors in the [OpenStreetMap](http://www.openstreetmap.org/) data.
We use the error data provided by [Keepright](http://www.keepright.at/) as the primary source of error data. The app is designed to be able to include further error sources like [OpenStreetBug](http://openstreetbugs.schokokeks.org/) or [Osmose](http://osmose.openstreetmap.fr/map/).

To simplify the integration in our app, only a few error types are actually used. The criteria here is, that only a single tag should be touched and the error description is clear by itself.
This rules out any vague error report like [FIXME tags](http://wiki.openstreetmap.org/wiki/Key:fixme) or the like.

Examples of error type we use are

* Missing speed limit
* Missing track type
* Point-of-interest without a name
* Place of worship without religion

On the first screen of the app the users sees a map with his current position and the errors around him.
Now he can choose to fix one of these. Each fix has to be checked by other users in order to complete it.
Once a fix is _completed_, it is sent back to OpenStreetMap to actually fix the map data.

The keep the users motivated to use the app, we built-in some "gamification" features.
So a users gets so called "koins" (_points_) for fixing and validating errors.
He then can check the highscore to compete against other players.
Finally he can earn badges for different kind of actions.

The whole gamification is a huge area and we only implemented a few basics.
There is a lot of room for improvement to keep the players motivated and  serve all the different types of gamers.

## Other repositories

* [odi86/kort-docu](https://github.com/odi86/kort-docu): Documents of Kort
* [odi86/kort-home](https://github.com/odi86/kort-home): Website of Kort (http://www.kort.ch)

## License

(The MIT License)

Copyright (c) 2012 Stefan Oderbolz, Jürg Hunziker

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
