'use strict';

var qs = require('query-string');
var request = require('request-promise');
var _ = require('lodash');

function validateAuth (auth) {
  return !!(auth.username && auth.password) || auth.bearer;
}

function validateOAuth (oauth) {
  var attributes = [ 'consumer_key', 'consumer_secret', 'signature_method', 'token', 'token_secret' ];

  for (var i = 0; i < attributes.length; ++i) {
    var attribute = attributes[ i ];

    if (_.isEmpty(oauth[ attribute ])) {
      return attribute;
    }
  }
}

var Client = function (baseUrl, auth) {
  auth = auth || {};

  // defaults to 'public' auth if none provided
  auth.type = auth.type || 'public';

  // required baseUrl
  if (!baseUrl) {
    throw new Error('Base URL is missing');
  } else {
    // add ending slash if not present
    if (_.last(baseUrl) !== '/') {
      baseUrl += '/';
    }
  }

  // validate basic auth
  if (auth.type === 'basic') {
    var isValidAuthAttribute = validateAuth(auth);
    if (isValidAuthAttribute) {
      this.auth = auth;
    } else {
      throw new Error('Auth\'s username and/or password is missing');
    }
  }

  // validate oauth
  if (auth.type === 'oauth') {
    var missingOAuthAttribute = validateOAuth(auth);
    if (missingOAuthAttribute) {
      throw new Error('OAuth\'s ' + missingOAuthAttribute + ' is missing');
    } else {
      this.oauth = auth;
    }
  }

  this.baseUrl = baseUrl;

  // Init API.
  this.projects = require('./api/projects')(this);
  this.repos = require('./api/repos')(this);
  this.branches = require('./api/branches')(this);
  this.tags = require('./api/tags')(this);
  this.prs = require('./api/prs')(this);
  this.users = require('./api/users')(this);
  this.hooks = require('./api/hooks')(this);
  this.settings = require('./api/settings')(this);
  this.commits = require('./api/commits')(this);
};

Client.prototype.getCollection = function (path, options) {
  options = options || {};
  options.args = _.defaults(options.args || {}, { 'limit': 1000 });
  return this.get(path, options);
};

Client.prototype.get = function (path, options) {
  options = options || {};
  options.args = options.args || {};
  var query = qs.stringify(options.args);
  if (query) {
    query = '?' + query;
  }

  var params = {
    uri: this.baseUrl + path + query,
    auth: this.auth,
    oauth: this.oauth,
    json: true
  };

  return request.get(params);
};

Client.prototype.put = function (path, data) {
  var params = {
    uri: this.baseUrl + path,
    headers: { 'Content-Type': 'application/json' },
    auth: this.auth,
    oauth: this.oauth,
    body: data,
    json: true
  };

  return request.put(params);
};

module.exports = Client;
