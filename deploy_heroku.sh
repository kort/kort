#!/bin/bash

# fail on first error
set -e

function cleanup {
    exit $?
}

trap "cleanup" EXIT

DIR=`dirname $0`

cp -r $DIR/build/production/Kort/* $DIR
ls -al
