# post-install script for fpm
# needed to rebuild npm package binaries and paths
cd /opt/sm/scylla/
sudo npm install --unsafe-perm

touch post-deploy-successful
