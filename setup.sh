#!/bin/bash
set -e

echo ""
echo "==========================================="
echo ""
echo "  /* VESSELS */ SETUP SCRIPT"
echo ""
echo "=========================================="
echo ""
echo "  This script will install dependencies"
echo "  for the /* Vessels */ browser-based"
echo "  interface, and reconfigure the file"
echo "  system to represent the structure of"
echo "  a /* Vessels */."
echo ""
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo ""

# Store the volume path in a variable
VOLUME_PATH="/Volumes/Vessels"

"Store the port number in a variable"
PORT=1009

# Store the type of install (demo / test / production)
INSTALL_TYPE="production"

# Store the current script directory in a variable
SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# Find the path to the Node.js executable
NODE_PATH=$(command -v node)

if [ -z "$NODE_PATH" ]; then
  echo "Node.js not found. Please install Node.js."
  exit 1
fi

# Seed empty folder structure in output placeholder folder
NODE_SEED_SCRIPT="./app-seed/src/seed.js"
OUTPUT_PATH="./build"

# Check if the directory exists
if [ -d "$OUTPUT_PATH" ]; then
  # Use rm with the -r option to remove the directory and its contents
  sudo rm -rf "$OUTPUT_PATH"
  echo "  Directory '$OUTPUT_PATH' has been deleted."
  echo ""
fi

echo "  Seeding folder structure...        "
echo ""

# Execute seed script
"$NODE_PATH" "$NODE_SEED_SCRIPT" "$OUTPUT_PATH"

echo ""
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo ""

# Specify the path to the application directories
INTERFACE_APP_DIR="./app-interface"
INTERFACE_APP_DIR_LABEL="vessels-interface"

VESSEL_APP_DIR="./app-vessel"
VESSEL_APP_DIR_LABEL="Start Here"

FILESYSTEM_APP_DIR="./app-filesystem"
FILESYSTEM_APP_LABEL="vessels-filesystem"

DEPENDENCIES_APP_DIR="./app-dependencies"
DEPENDENCIES_APP_LABEL="vessels-node"

SEED_APP_DIR="./app-seed"

# Change the working directory to the interface node app directory
cd "$INTERFACE_APP_DIR" || exit

echo "  Installing interface dependencies..."
echo ""

# Run npm install in the specified directory
npm install

echo ""
echo "  Creating .env file for /Volumes/Vessels..."

# Change back to the original directory where your script is located
cd "$SCRIPT_DIR" || exit

# Create a .env file in the interface app directory
echo -e "OUTPUT_FOLDER=$VOLUME_PATH\nVESSELS_ROOT=$VOLUME_PATH\nNAME_APP_FILESYSTEM=$FILESYSTEM_APP_LABEL\nINSTALL_TYPE=$INSTALL_TYPE\nPORT=$PORT" > "$INTERFACE_APP_DIR/.env"

# Check if the .env file was created
if [ -f "$INTERFACE_APP_DIR/.env" ]; then
  echo "  .env file created!"
else
  echo "  Failed to create .env file."
fi

echo ""
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo ""
echo "  Moving filesystem application...    "

NODE_ADD_SOURCECODE_SCRIPT="./app-filesystem/src/record/addSourceCodeRecord.js"

# Copy the 'app-filesystem' folder from the source to the destination
"$NODE_PATH" "$NODE_ADD_SOURCECODE_SCRIPT" "$OUTPUT_PATH" "$FILESYSTEM_APP_DIR" "Source Code" "$FILESYSTEM_APP_LABEL" 2 4

echo "  Filesystem application moved!    "
echo ""
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo ""

# Change back to the original directory where your script is located
cd "$SCRIPT_DIR" || exit

echo "  Moving interface application...    "

# Copy the 'app-filesystem' folder from the source to the destination
"$NODE_PATH" "$NODE_ADD_SOURCECODE_SCRIPT" "$OUTPUT_PATH" "$INTERFACE_APP_DIR" "Source Code" "$INTERFACE_APP_DIR_LABEL" 2 4

echo "  Interface application moved!    "
echo ""
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo ""

# Change back to the original directory where your script is located
cd "$SCRIPT_DIR" || exit

# Move dependencies (node executables)
echo "  Copying Node executables..."

# Copy the 'app-dependencies' folder from the source to the destination
"$NODE_PATH" "$NODE_ADD_SOURCECODE_SCRIPT" "$OUTPUT_PATH" "$DEPENDENCIES_APP_DIR" "Source Code" "$DEPENDENCIES_APP_LABEL" 3 5

echo "  Node executables copied!"
echo ""
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo ""

# Change back to the original directory where your script is located
cd "$SCRIPT_DIR" || exit

echo "  Setting permissions on vessel scripts..."

# Use chmod to change the permissions vessel scripts
chmod +x $VESSEL_APP_DIR/*.sh

# Check if the permissions were successfully changed
if [ $? -eq 0 ]; then
  echo "  Permissions set!"
else
  echo "Failed to change permissions."
fi

echo ""
echo "  Moving vessel application...    "

# Copy the 'app-filesystem' folder from the source to the destination
VESSEL_APP_DIR_RESULT=$("$NODE_PATH" "$NODE_ADD_SOURCECODE_SCRIPT" "$OUTPUT_PATH" "$VESSEL_APP_DIR" "Beginning" "$VESSEL_APP_DIR_LABEL" 1 1)

NEW_VESSEL_APP_DIR="${VESSEL_APP_DIR_RESULT:2}"

echo "  $NEW_VESSEL_APP_DIR"
echo "  Vessel application moved!    "
echo ""

cd "$SCRIPT_DIR" || exit


# Check if osacompile is available before attempting to use it
if command -v osacompile &> /dev/null; then
  echo "  Creating .plist file...   "

  # Specify the path to the vessel app dir in the AppleScript
  LOCAL_VESSEL_APP_DIR="${NEW_VESSEL_APP_DIR:5}"

  # Specify the values you want to inject (replace placeholders)
  MAC_RUN_SCRIPT_PATH="$VOLUME_PATH$LOCAL_VESSEL_APP_DIR/run-script.sh"

  PLIST_LABEL="com.vessels.launch-agent"

  # Specify the path to the .plist template file
  PLIST_TEMPLATE="./$NEW_VESSEL_APP_DIR/$PLIST_LABEL.plist.template"

  # Create a temporary file for the modified .plist
  TEMP_PLIST="temp.plist"

  # Replace placeholders in the .plist template
  sed "s|%MAC_RUN_SCRIPT_PATH%|${MAC_RUN_SCRIPT_PATH}|;s|%LABEL%|${PLIST_LABEL}|" "$PLIST_TEMPLATE" > "$TEMP_PLIST"

  # Rename the temporary file to the final .plist file
  mv "$TEMP_PLIST" "./$NEW_VESSEL_APP_DIR/$PLIST_LABEL.plist"

  # Delete template file
  rm "$PLIST_TEMPLATE"

  echo "  .plist file created!"
  echo ""

  echo "  Creating mac installation script..."

  # Specify the path to the AppleScript template
  APPLESCRIPT_TEMPLATE="./$NEW_VESSEL_APP_DIR/install.applescript.template"

  # Create a temporary file for the modified AppleScript
  TEMP_APPLESCRIPT="temp.applescript"

  # Replace placeholders in the AppleScript template
  sed "s|%LOCAL_VESSEL_APP_DIR%|${LOCAL_VESSEL_APP_DIR}|;s|%LABEL%|${PLIST_LABEL}|;s|%VOLUME_PATH%|${VOLUME_PATH}|" "$APPLESCRIPT_TEMPLATE" > "$TEMP_APPLESCRIPT"

  # mv "$TEMP_APPLESCRIPT" "./$NEW_VESSEL_APP_DIR/$TEMP_APPLESCRIPT"

  # Compile the modified AppleScript
  osacompile -o "vessels-install.app" "$TEMP_APPLESCRIPT"

  # Rename the compiled script
  mv "vessels-install.app" "./$NEW_VESSEL_APP_DIR/>> install.app"

  # Delete temp file
  rm "$TEMP_APPLESCRIPT"

  # Delete template file
  rm "$APPLESCRIPT_TEMPLATE"

  echo "  mac installatoin script created!"
  echo ""
  echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
  echo ""
else
    echo "  Skipping Mac-specific setup."
    echo ""
    echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
fi


# Generate initial questions
echo "  Generating initial questions..."

NODE_QUESTION_GENERATION_SCRIPT="./app-seed/src/utils/createInitialQuestionRecords.js"

# Execute question generation script
"$NODE_PATH" "$NODE_QUESTION_GENERATION_SCRIPT" "$OUTPUT_PATH"

echo "  Initial questions generated!"
echo ""
echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
echo ""

echo "  ...Done!"
echo ""
echo "  Next Steps:"
echo ""
echo "  1. Copy /build to your vessel."
echo "  2. Rename the vessel volume to \"Vessels\""
echo "  3. Look for the \"START_HERE\" directory"
echo "     in one of the top folders."
echo "  4. Run the >>install script."
echo ""
echo "==========================================="
echo ""
echo ""
echo ""
echo ""
echo ""
