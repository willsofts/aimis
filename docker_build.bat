echo "copy default_aiven.json to default.json"
copy /Y .\config\default-aiven.json .\config\default.json
echo "start build docker image"
docker build --build-arg NPM_TOKEN=%NPM_TOKEN% -t willsofts/aimis .
echo "copy default_localhost.json to default.json"
copy /Y .\config\default-localhost.json .\config\default.json
