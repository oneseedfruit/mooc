#!/usr/bin/bash

cd /home/ranmaru90/gitrepo/mooc/frontend/
screen -S frontend -dm sh -c 'yarn start; echo $?; read'
