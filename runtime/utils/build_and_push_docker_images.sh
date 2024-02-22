#!/usr/bin/env bash

set -euo pipefail

DIGITALOCEAN_REPO="registry.digitalocean.com/cexa"

declare -A LANGUAGES=(["javascript"]="javascript.Dockerfile" ["python"]="python.Dockerfile" ["typescript"]="typescript.Dockerfile")

authenticate_docr() {
  echo "Authenticating Digital Ocean Container Registry..."
  doctl registry login --never-expire
}

build_docker_image() {
  local language=$1
  local dockerfile=${LANGUAGES[${language}]}
  local repo_tag="${DIGITALOCEAN_REPO}/${language}:latest"
  echo "Building Docker image for ${language}..."
  docker buildx build \
    --platform "${ARCHITECTURE}" \
    -t "${repo_tag}" -f ./runtime/"${dockerfile}" .
}

push_docker_image() {
  local language=$1
  local repo_tag="${DIGITALOCEAN_REPO}/${language}:latest"
  echo "Pushing Docker image for ${language}..."
  if docker push "${repo_tag}"; then
    delete_previous_image "${language}"
  else
    echo "Failed to push Docker image for ${language}."
  fi
}

delete_previous_image() {
  local language=$1
  local previous_image
  previous_image=$(docker images --format '{{.Repository}}:{{.Tag}}' | grep "${DIGITALOCEAN_REPO}/${language}" | head -n 1)
  if [[ -n "${previous_image}" ]]; then
    echo "Deleting previous image: ${previous_image}"
    docker rmi "${previous_image}"
  fi
}

build_and_push_images() {
  for language in "${!LANGUAGES[@]}"; do
    build_docker_image "${language}"
    push_docker_image "${language}"
  done
  echo "All Docker images have been built and pushed to DOCR."
}

main() {
  authenticate_docr

  # Prompt for architecture platform
  read -r -p "Enter the architecture platform (e.g., linux/amd64): " ARCHITECTURE

  build_and_push_images
}

main
