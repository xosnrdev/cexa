#!/usr/bin/env bash

set -e

outputDir="./docker/env/images"

mkdir -p $outputDir

declare -A languages=(["javascript"]="javascript.Dockerfile" ["python"]="python.Dockerfile" ["typescript"]="typescript.Dockerfile")

for language in "${!languages[@]}"; do
  echo "Building Docker image for $language..."

  lima nerdctl build -t $language:latest -f ./docker/lib/${languages[$language]} .

  echo "Saving Docker image for $language to a tar file..."

  lima nerdctl save $language:latest >$outputDir/$language.tar
done

echo "Done!"
