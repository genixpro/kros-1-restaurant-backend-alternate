#!/bin/bash

# Start Mongo database
mongod &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to start Mongo: $status"
  exit $status
fi

# Start the main server
grunt serve &
status=$?
if [ $status -ne 0 ]; then
  echo "Failed to run 'grunt serve': $status"
  exit $status
fi



# Naive check runs checks once a minute to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container exits with an error
# if it detects that either of the processes has exited.
# Otherwise it loops forever, waking up every 60 seconds

while sleep 1; do
  ps aux |grep mongod |grep -q -v grep
  MONGO_STATUS=$?
  ps aux |grep grunt |grep -q -v grep
  SERVER_STATUS=$?
  # If the greps above find anything, they exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $MONGO_STATUS -ne 0 -o $SERVER_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit 1
  fi
done

