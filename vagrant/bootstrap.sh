#!/usr/bin/env bash

yellow='\e[0;33m'
red='\e[0;31m'
NC='\e[0m' # No Color

if [ ! -f /var/log/0usersetup ];
then
    echo -e "${yellow}Setting up User: Scylla${NC}"
    useradd -d /home/scylla -m scylla -p scylla
    #When we login, we always want to get dumped into the /vagrant directory... add this to .bashrc
    echo cd /vagrant >> /home/vagrant/.bashrc
    touch /var/log/0usersetup
fi

if [ ! -f /var/log/1aptsetup ];
then
    echo -e "${yellow}Setting up Apt Sources${NC}"
    sudo apt-get update
    # Required for apt-add-repository
    sudo apt-get install -y python-software-properties build-essential
    sudo apt-add-repository -y ppa:chris-lea/node.js
    wget http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
    sudo apt-key add rabbitmq-signing-key-public.asc
    echo "deb http://www.rabbitmq.com/debian/ testing main" | sudo tee -a /etc/apt/sources.list
    sudo apt-get update
    touch /var/log/1aptsetup
fi

if [ ! -f /var/log/2systemsetup ];
then
    echo -e "${yellow}Installing system pre-reqs${NC}"
    sudo apt-get install -y git imagemagick openssl

#Generate our own self-signed ssl keys
#    mkdir /etc/ssl/self-signed && cd /etc/ssl/self-signed
#    openssl genrsa -out server.key 2048 && openssl req -new -key server.key -out server.csr -subj '/C=US/ST=Washington/L=Seattle/O=Scylla/OU=Scylla/CN=Scylla' && openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

    touch /var/log/2systemsetup
fi

if [ ! -f /var/log/3mysqlsetup ];
then
    echo -e "${yellow}Installing MySQL${NC}"
    sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password password scylla'
    sudo debconf-set-selections <<< 'mysql-server-5.5 mysql-server/root_password_again password scylla'
    sudo apt-get install -y mysql-client-core-5.5 mysql-server-5.5

    echo "CREATE USER 'scylla'@'localhost' IDENTIFIED BY 'scylla'" | mysql -uroot -pscylla
    echo "CREATE DATABASE scylla" | mysql -uroot -pscylla
    echo "GRANT ALL ON scylla.* TO 'scylla'@'localhost'" | mysql -uroot -pscylla
    echo "flush privileges" | mysql -uroot -pscylla

    cp /vagrant/config/database-example.js /vagrant/config/database.js

    if [ -f /vagrant/vagrant/data/initial.sql ];
    then
        mysql -uroot -pscylla scylla < /vagrant/data/initial.sql
    fi

    touch /var/log/3mysqlsetup
fi

if [ ! -f /var/log/3rabbitsetup ];
then
    echo -e "${yellow}Installing RabbitMQ${NC}"
    sudo apt-get install -y rabbitmq-server

    #Initialize the web interface
    sudo rabbitmq-plugins enable rabbitmq_management
    sudo /etc/init.d/rabbitmq-server restart

    #Setup Scylla User
    rabbitmqctl add_vhost scyllavhost
    rabbitmqctl add_user scylla scylla
    rabbitmqctl set_permissions -p scyllavhost scylla ".*" ".*" ".*"
    rabbitmqctl set_user_tags scylla management

    #Setup Heartbeat User
    rabbitmqctl add_vhost statuscheckvhost
    rabbitmqctl add_user heartbeat alive
    rabbitmqctl set_permissions -p statuscheckvhost heartbeat ".*" ".*" ".*"
    rabbitmqctl set_user_tags heartbeat management


    touch /var/log/3rabbitsetup
fi

if [ ! -f /var/log/4nodejssetup ];
then
    echo -e "${yellow}Installing NodeJS${NC}"
    sudo apt-get install -y nodejs
    sudo npm install -g bower supervisor bunyan
    touch /var/log/4nodejssetup
fi

if [ ! -f /var/log/5upstart ];
then
    echo -e "${yellow}Setup Upstart Script${NC}"
    sudo cp /vagrant/vagrant/scylla-dev-upstart.conf /etc/init/scylla.conf
    chmod a+x /etc/init/scylla.conf
    touch /var/log/5upstart
fi

if [ ! -f /vagrant/scylla/config/mail.js ];
then
    echo -e "${red}EXAMPLE MAIL FILE USED, EMAIL WILL NOT BE ABLE TO BE SENT${NC}"
    cp /vagrant/config/mail-example.js /vagrant/config/mail.js
fi

if [ ! -f /vagrant/scylla/config/storage.js ];
then
    echo -e "${red}EXAMPLE STORAGE FILE USED. Images will be stored in default location ${NC}"
    cp /vagrant/config/storage-example.js /vagrant/config/storage.js
    mkdir -p /vagrant/images/resources
    chown vagrant /vagrant/images/resources
fi

if [ -f /var/run/scylla.pid ];
then
    stop scylla
fi

echo -e "${yellow}Installing Scyalla NPM Deps${NC}"

#We've got to run the installs as the vagrant user, as npm and bower HATE being root.
su -c "/vagrant/vagrant/bootstrap-user-context.sh" vagrant


start scylla