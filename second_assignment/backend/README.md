# REST API #

## Installation ##
To run this application, you will require [NodeJS](https://nodejs.org/en/download/).

If you have NodeJS already installed, clone this repo using git and run `npm install` in the root directory, otherwise, follow the instructions to install NodeJS:

* [Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)
* [Mac](http://blog.teamtreehouse.com/install-node-js-npm-mac)
* [Linux](https://nodejs.org/en/download/package-manager/)

Once NodeJS is installed and working, install the project dependencies:

```
npm install
```

## Starting the API ##

To start the REST API server, run the following command in the root directory:

```
npm start
```

The output should be:

```
Listening on port 3000
```

## API ##
This ExpressJS app exposes a very simple REST API.

There are two endpoints, both of which can be used to PUT or GET data.

### GET /v1/api/dsus ###
Returns a JSON object with a list of all DSU's

### GET /v1/api/sites ###
Returns a JSON object with a list of all sites

### PUT /v1/api/dsus ###
Adds a new DSU.

#### Parameters ####
Parameter Name| Parameter Type | Parameter Content | Other Information
--- | --- | --- | ---
name | String | Name of the DSU | Required. Max 10 characters
description | String | Description of the DSU | Required. Max 20 characters
cert | Number | The value of Operations Certificate of the DSU | Optional. If provided, must be greater than 0

### PUT /v1/api/sites ###
Adds a new site.

#### Parameters ####
Parameter Name| Parameter Type | Parameter Content | Other Information
--- | --- | --- | ---
dsuId | Number | The id of the DSU that the site is attached to | Required.
name | String | The name of the site | Required. Max 10 characters
description | String | Description of the site | Required. Max 20 characters


