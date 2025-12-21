SUBMODULE_GITHUB=github.com/kkhys/private-content
SUBMODULE_PATH=private-content

if [ "$GITHUB_ACCESS_TOKEN" == "" ]; then
  echo "Error: GITHUB_ACCESS_TOKEN is empty"
  exit 1
fi

set -e

output=`git submodule status --recursive`
no_prefix=${output#*-}
COMMIT=${no_prefix% *}

rm -rf tmp || true
mkdir tmp
cd tmp

git init
git remote add origin https://$GITHUB_ACCESS_TOKEN@$SUBMODULE_GITHUB
git fetch --depth=1 origin $COMMIT
git checkout $COMMIT

cd ..
rm -rf tmp/.git
mv tmp/* $SUBMODULE_PATH/

rm -rf tmp
