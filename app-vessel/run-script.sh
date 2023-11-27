#!/bin/bash

# Check if the platform is macOS
if [ "$(uname -s)" != "Darwin" ]; then
  echo "This script is intended for macOS only."
  exit 1
fi

# Detect the macOS architecture
arch=$(uname -m)

# Initialize the vessel_drive_path, node_path, and script_path variables
vessel_drive_path=""
node_path=""
script_path=""

# Define the folder names for different architectures
if [ "$arch" == "x86_64" ]; then
  target_folder="node_macos_x86_64"
elif [ "$arch" == "arm64" ]; then
  target_folder="node_macos_arm64"
else
  echo "Unsupported architecture: $arch"
  exit 1
fi

# Search for a vessel with the name "Vessels"
vessel_drive_name="Vessels"
vessel_drive_path=$(find /Volumes -maxdepth 1 -type d -name "$vessel_drive_name" -print -quit)

if [ -z "$vessel_drive_path" ]; then
  echo "Vessel with the name '$vessel_drive_name' not found."
  exit 1
fi

# Search for the target folder recursively within the vessel
node_path=$(find "$vessel_drive_path" -type d -name "$target_folder" -print -quit)

if [ -z "$node_path" ]; then
  echo "Node.js distribution folder not found for architecture: $arch on the vessel."
  exit 1
fi

# Set the path to the Node.js distribution
node_path="$node_path/bin/node"

# Search for the specific script file
script_name="vessels-start.js"
script_path=$(find "$vessel_drive_path" -type f -name "$script_name" -print -quit)

if [ -z "$script_path" ]; then
  echo "Script '$script_name' not found on the vesesl."
  exit 1
fi

# Change to the script directory
script_directory=$(dirname "$script_path")
cd "$script_directory" || exit

# Run the Node.js script using the selected Node.js distribution
NODE_ENV=production "$node_path" -r dotenv/config  "$script_path" &