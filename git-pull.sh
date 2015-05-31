#!/bin/bash

BASEDIR=$(dirname $BASH_SOURCE)
GITDIR=$(find ${BASEDIR} -name .git)

if [ "X$GITDIR" == "X" ]; then
   echo "Failed to find GITDIR under ${BASEDIR}"
   exit 1 
fi

DIR=$(dirname $GITDIR)

(
    date
    if [ ! -d "$DIR" ]; then
	echo "Could not find repo dir in $DIR"
	exit 0
    fi

    cd "$DIR"
    git pull
    echo "RET=$? after ${SECONDS} second(s)"
) | tee -a ~/git-pull.log
