#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <image-tag>"
  echo "Example: $0 7f4b599"
  exit 1
fi

TAG="$1"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

BACKEND_FILE="$ROOT_DIR/kubernetes/backend-deployment.yaml"
FRONTEND_FILE="$ROOT_DIR/kubernetes/frontend-deployment.yaml"

if [[ ! -f "$BACKEND_FILE" || ! -f "$FRONTEND_FILE" ]]; then
  echo "Error: Kubernetes deployment files not found."
  exit 1
fi

sed -i.bak -E "s|(image:\\s*bhanu0710/mern-backend:).*|\\1${TAG}|g" "$BACKEND_FILE"
sed -i.bak -E "s|(image:\\s*bhanu0710/mern-frontend:).*|\\1${TAG}|g" "$FRONTEND_FILE"
rm -f "${BACKEND_FILE}.bak" "${FRONTEND_FILE}.bak"

echo "Updated image tags to '${TAG}' in:"
echo " - kubernetes/backend-deployment.yaml"
echo " - kubernetes/frontend-deployment.yaml"

