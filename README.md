AppSeed Platform
========

AppSeed Platform based on MEAN stack

## Prerequisites

* [Node.js](http://nodejs.org)
* [NPM](http://npmjs.org). We will also have npm installed when installing Node.js. We use NPM to install the Node dependencies.
* [Bower](http://bower.io/). We use Bower to install the front end dependencies.
* [Grunt](http://gruntjs.com). We use Grunt to automate some tasks.
* [Yeoman](http://yeoman.io/). We use Yeoman to scaffold the application based on the [generator-angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack).
* [MongoDB](http://www.mongodb.org/). We use MongoDB to store the data.

## Install the dependencies

```
# install the required Node.js modules
npm install
# install the required front end modules
bower install
```

## How to build

Execute the following command to build the application:

```
grunt build
```

The deployable application will be available on `/dist` directory.

## How to run

Execute the following command to run the application:

### In development mode

```
grunt serve
```

### In debug mode

```
grunt serve:debug
```

### In production mode

```
grunt serve:dist
```

This will open up a new window in browser http://localhost:8080/debug?port=5858

## How to test

Execute the following command to test the application:

```
# To test the client end
grunt test:client

# To test the server end
grunt test:server

# To test both client and server
grunt test
```
