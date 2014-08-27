###
### A copy of the scylla deb builder script in case Jenkins explodes
###

echo "Time to make a deb file!"

echo "getting configuration"

deb_name=`grep "\"name\"" $APP_WORKSPACE/package.json | sed -e 's/^.*: //p' | tr -d \"\, | uniq`
deb_version=`grep "\"version\"" $APP_WORKSPACE/package.json | sed -e 's/^.*: //p' | tr -d \"\, | uniq`

echo $deb_name
echo $deb_version

echo "Cleaning up..."

rm -f *.deb 
rm -rf to_deb/
mkdir to_deb/
cd to_deb/

echo "Creating necessary directories"

mkdir -p opt/sm/$deb_name
mkdir -p etc/init

cd ..

echo "Making bin and conf stuff"

ls -l

chmod 755 $APP_WORKSPACE/deploy/$deb_name
cp -R -p $APP_WORKSPACE/deploy/$deb_name.conf ./to_deb/etc/init/

echo "Copying over necessary files specified in files.whitelist"

for file in $(cat $APP_WORKSPACE/deploy/files.whitelist); do
    echo "copying:" $file
    cp -R -p $APP_WORKSPACE/$file to_deb/opt/sm/$deb_name
done

echo "building .deb with fpm"

cd to_deb/
fpm -s dir -t deb -n $deb_name --after-install ./opt/sm/scylla/rebuild.sh -v $deb_version ./* 
mv *.deb ./../

echo "post creation clean up"
cd ..
rm -rf ./to_deb

echo "all done!"