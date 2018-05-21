# get most recent tag
TAG=$(git describe)
# write a version.json to public
echo "{ \"version\": \"${TAG}\" }" > ./public/version.json
# build app
meteor build ../precision-build --architecture os.linux.x86_64
cp settings*.json ../precision-build