#!/usr/bin/env bash

set -e

BUILD_DIR="./nix/images"

mkdir -p "$BUILD_DIR"

build_language() {
  local language=$1
  local file=$2

  echo "Building $language environment..."
  # Attempt to build the environment and store the result in the build directory
  if nix-build "$file" --no-out-link -o "$BUILD_DIR/$language"; then
    echo "Build successful. Result is in $BUILD_DIR/$language"
  else
    echo "Build failed for $language."
    exit 1
  fi
}

build_language "python" "./nix/python.nix"

build_language "javascript" "./nix/javascript.nix"

build_language "typescript" "./nix/typescript.nix"

echo "All builds completed."
