#!/usr/bin/bash

cd /home/ranmaru90/gitrepo/mooc/backend/
screen -S backend -dm sh -c 'npm run watch; echo $?; read'
