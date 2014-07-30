#!/bin/bash

### local script to run for dev

echo "Time to make a deb file!"

if ! gem spec fpm > /dev/null 2>&1; then
    echo "Gem fpm is not installed! installing!"
    sudo gem install fpm
fi

echo "getting configuration"

deb_name=`grep "\"name\"" package.json | sed -e 's/^.*: //p' | tr -d \"\, | uniq`
deb_version=`grep "\"version\"" package.json | sed -e 's/^.*: //p' | tr -d \"\, | uniq`

echo $deb_name
echo $deb_version

echo "Cleaning up..."

rm *.deb 2> /dev/null
rm -rf to_deb/
mkdir to_deb/
cd to_deb/

echo "Creating necessary directories"

mkdir -p opt/sm/$deb_name
mkdir -p etc/init
mkdir -p bin

cd ..

echo "Making bin and conf stuff"
ls -l
chmod 755 ./deb_files/$deb_name
cp ./deb_files/$deb_name ./to_deb/bin
cp ./deb_files/$deb_name.conf ./to_deb/etc/init/

echo "Copying over necessary files specified in deb-files.whitelist"

for file in $(cat deb_files/files.whitelist); do
    echo "copying:" $file
    cp -R $file to_deb/opt/sm/$deb_name
done

echo "building .deb with fpm"

cd to_deb/
fpm -s dir -t deb -n $deb_name -v $deb_version ./*
mv *.deb ./../

echo "post creation clean up"
cd ..
#rm -rf ./to_deb

echo "all done!"


# bash -c '

# rm -f *.deb
# rm -rf opt
# rm -rf etc
# rm -rf var

# mkdir -p opt/sm/$APP_ARTIFACT
# mkdir -p etc/init
# mkdir -p var/log/$APP_ARTIFACT
# mkdir -p var/lib/$APP_ARTIFACT

# cp -R -p $APP_WORKSPACE/* $APP_WORKSPACE/ opt/sm/$APP_ARTIFACT/
# cp -R -p $APP_WORKSPACE/deploy/$APP_ARTIFACT.conf etc/init
# touch var/log/$APP_ARTIFACT/$APP_ARTIFACT.log
# touch var/lib/$APP_ARTIFACT/$APP_ARTIFACT

# export APP_VERSION=`cat $APP_WORKSPACE/version.txt`

# # Check if app version already exists
# if s3cmd info s3://sm-artifacts/${APP_ARTIFACT} && s3cmd info s3://sm-artifacts/${APP_ARTIFACT}/${APP_ARTIFACT}_${APP_VERSION}_amd64.deb
#         then echo "ARTIFACT: ${APP_ARTIFACT}_${APP_VERSION}_amd64.deb ALREADY EXISTS! BUMP YOUR PROJECTS VERSION DUDE!"
#         exit -1
# fi

# if [ -e "$APP_WORKSPACE/deploy/post_install.sh" ]
# then POST_INSTALL="--after-install $APP_WORKSPACE/deploy/post_install.sh"
# fi

# fpm -s dir -t deb -n $APP_ARTIFACT -v $APP_VERSION --description "$APP_DESCRIPTION" $POST_INSTALL --deb-user deploy --deb-group sysadmin opt etc var
# '





## jenkins script ##

# echo "Time to make a deb file!"

# echo "getting configuration"

# deb_name=`grep "\"name\"" $APP_WORKSPACE/package.json | sed -e 's/^.*: //p' | tr -d \"\, | uniq`
# deb_version=`grep "\"version\"" $APP_WORKSPACE/package.json | sed -e 's/^.*: //p' | tr -d \"\, | uniq`

# echo $deb_name
# echo $deb_version

# echo "Cleaning up..."

# rm -f *.deb 
# rm -rf to_deb/
# mkdir to_deb/
# cd to_deb/

# echo "Creating necessary directories"

# mkdir -p opt/sm/$deb_name
# mkdir -p etc/init
# mkdir -p bin

# cd ..

# echo "Making bin and conf stuff"

# ls -l

# chmod 755 $APP_WORKSPACE/deploy/$deb_name
# cp -R -p $APP_WORKSPACE/deploy/$deb_name ./to_deb/bin
# cp -R -p $APP_WORKSPACE/deploy/$deb_name.conf ./to_deb/etc/init/

# echo "Copying over necessary files specified in files.whitelist"

# for file in $(cat $APP_WORKSPACE/deploy/files.whitelist); do
#     echo "copying:" $file
#     cp -R -p $APP_WORKSPACE/$file to_deb/opt/sm/$deb_name
# done

# echo "building .deb with fpm"

# cd to_deb/
# fpm -s dir -t deb -n $deb_name -v $deb_version ./*
# mv *.deb ./../

# echo "post creation clean up"
# cd ..
# rm -rf ./to_deb

# echo "all done!"