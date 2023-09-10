#!/usr/bin/env bash
for dir in exercises/*/{practice,solution}/; do (pushd "$dir" && npm install && popd); done
for dir in samples/*/; do (pushd "$dir" && npm install && popd); done
