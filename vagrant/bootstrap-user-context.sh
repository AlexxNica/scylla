#!/usr/bin/env bash

#Do the installs
cd /vagrant
if [ ! -f ~/6node-packages ];
then
    echo -e "${yellow}Installing Node Packages{NC}"
    npm install
    touch ~/6node-packages
fi

cd /vagrant
if [ ! -f ~/7bower-packages ];
then
    echo -e "${yellow}Installing Bower Packages{NC}"
    cd /vagrant/public
    bower install
    cd /vagrant
    touch ~/7bower-packages
fi

