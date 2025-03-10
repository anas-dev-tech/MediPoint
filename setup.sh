#!/bin/bash

# Hardcoded project directories
PROJECT_1_DIR="./frontend/doctor/"  # Replace with the actual path to your first project
PROJECT_2_DIR="./frontend/patient/"  # Replace with the actual path to your second project

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

# Step 1: Build both npm projects
build_project $PROJECT_1_DIR
build_project $PROJECT_2_DIR

# Step 2: Run docker-compose and print output in real-time
echo "Starting Docker containers..."
docker compose up --build 2>&1 | tee docker-compose.log

# Check if docker-compose ran successfully
if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "docker-compose command failed. Exiting..."
  exit 1
fi

echo "Projects built and Docker containers started successfully!"