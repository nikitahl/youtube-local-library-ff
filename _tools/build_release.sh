#!/bin/bash

# Create a release directory
mkdir release

# Copy the desired files and directories into the release directory
cp -r *.html manifest.json images dist release/

# Zip the release directory
zip -r release.zip release

# Clean up
rm -rf release