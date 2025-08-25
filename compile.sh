#!/bin/csh

# npm install

setenv NODE_OPTIONS "--openssl-legacy-provider"
setenv REACT_APP_APP_API_HOST_ORIGIN /w2020

rm -rf rule-game 
mkdir rule-game

setenv REACT_APP_DEBUG_MODE_ENABLED true
echo "Compiling with REACT_APP_DEBUG_MODE_ENABLED=$REACT_APP_DEBUG_MODE_ENABLED"
# setenv REACT_APP_APP_API_HOST_ORIGIN http://localhost:8080/w2020
rm -rf build 
npm run build
mv build rule-game/dev

echo "Compiling with REACT_APP_DEBUG_MODE_ENABLED=$REACT_APP_DEBUG_MODE_ENABLED"
setenv REACT_APP_DEBUG_MODE_ENABLED false
# setenv REACT_APP_APP_API_HOST_ORIGIN http://localhost:8080/w2020
rm -rf build
npm run build
mv build rule-game/prod

rm -f rule-game.war
(cd rule-game; jar -cvf ../rule-game.war .)

