# grant meteor build more memory
#TOOL_NODE_FLAGS="--max-old-space-size=4096"
#NODE_OPTIONS="--max-old-space-size=8192"
# get most recent tag
TAG=$(git describe)
# write a version.json to public
echo "{ \"version\": \"${TAG}\" }" > ./public/version.json
# build app
TOOL_NODE_FLAGS="--max-old-space-size=4096" meteor build ../precision-build --architecture os.linux.x86_64
cp settings*.json ../precision-build