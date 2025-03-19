#!/bin/bash

# Check if the .env file exists
if [[ ! -f .env ]]; then
  echo "Error: .env file not found!"
  exit 1
fi

# Read the .env file line by line
while IFS='=' read -r key value; do
  # Skip empty lines or comments
  if [[ -n $key && $key != "#"* ]]; then
    # Export the variable
    export "$key=$value"
    echo "Exported: $key=$value"
  fi
done < .env

echo "All variables from .env have been exported."
# Hardcoded project directories
PROJECT_1_DIR="./frontend/doctor/"  # Replace with the actual path to your first project
PROJECT_2_DIR="./frontend/patient/"  # Replace with the actual path to your second project

# Initialize skip flags
SKIP_FRONTEND=false

# Function to build an npm project
build_project() {
  local DIR=$1
  echo "Building the npm project in $DIR..."
  npm --prefix $DIR install
  npm --prefix $DIR run build

  # Check if the build was successful
  if [ $? -ne 0 ]; then
    echo "npm build failed in $DIR. Exiting..."
    exit 1
  fi
}

# Parse command-line arguments
while getopts ":s:-:" opt; do
  case ${opt} in
    s )
      if [ "$OPTARG" == "frontend" ]; then
        SKIP_FRONTEND=true
      else
        echo "Invalid argument for -s: $OPTARG" >&2
        exit 1
      fi
      ;;
    - )
      case "${OPTARG}" in
        skip )
          val="${!OPTIND}"; OPTIND=$(( OPTIND + 1 ))
          if [ "$val" == "frontend" ]; then
            SKIP_FRONTEND=true
          else
            echo "Invalid argument for --skip: $val" >&2
            exit 1
          fi
          ;;
        * )
          echo "Invalid option: --${OPTARG}" >&2
          exit 1
          ;;
      esac
      ;;
    \? )
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    : )
      echo "Invalid option: -$OPTARG requires an argument" >&2
      exit 1
      ;;
  esac
done

# Step 1: Build both npm projects if not skipped
if [ "$SKIP_FRONTEND" = false ]; then
  build_project $PROJECT_1_DIR
  build_project $PROJECT_2_DIR
else
  echo "Skipping frontend build process..."
fi

# Step 2: Run docker-compose and print output in real-time
echo "Starting Docker containers..."
docker compose up --build 2>&1 | tee docker-compose.log

# Check if docker-compose ran successfully
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "docker-compose command failed. Exiting..."
  exit 1
fi

echo "Projects built and Docker containers started successfully!"