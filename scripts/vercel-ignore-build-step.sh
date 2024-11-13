#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

case "$VERCEL_GIT_COMMIT_REF" in
  staging|main)
    echo "Build can proceed"
    exit 1
    ;;
  *)
    echo "Build cancelled"
    exit 0
    ;;
esac
