FROM node:6.17-slim

# Install global dependencies
RUN apt update
RUN apt install python build-essential mongodb-server procps ruby-sass git -y
RUN npm install bower grunt-cli -g

# Create Mongos data directory
RUN mkdir /data/
RUN mkdir /data/db

# Preinstall, helps prevent too much extra cpu usage when rebuilding many times
RUN mkdir /app/
COPY package.json /app/
COPY bower.json /app/
COPY .bowerrc /app/
RUN mkdir /app/client
WORKDIR /app/
RUN npm install
RUN bower install --allow-root

# Install netcat
RUN apt install netcat -y

# Cleanup, purge unused packages
RUN apt purge python build-essential git -y

# Copy over the code
COPY / /app
WORKDIR /app

# Prep for execution
EXPOSE 3000
EXPOSE 5858
ENTRYPOINT /app/run.sh

