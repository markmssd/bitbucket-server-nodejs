'use strict';

var async = require('async');
var utils = require('lodash');
var Promise = require('bluebird');

function filterByAuthor (author) {
  return function (pr) {
    return !author || author === pr.author.user.name;
  };
}

function filterByFork (fork) {
  return function (pr) {
    var from = pr.fromRef.repository.project.key + '/' + pr.fromRef.repository.slug;
    var to = pr.toRef.repository.project.key + '/' + pr.toRef.repository.slug;
    return (fork) ? from !== to : from === to;
  }
}

module.exports = function (client) {
  var repos = require('./repos')(client);
  return {
    get: function (projectKey, repo, options) {
      if (!options) {
        options = {};
      }

      var clientOptions = { args: { 'state': options.state || 'OPEN' } };
      var path = 'projects/' + projectKey + '/repos/' + repo + '/pull-requests';

      return client.getCollection(path, clientOptions).then(function (response) {
        // filter by author.
        if (options.author) {
          response.values = response.values.filter(filterByAuthor(options.author));
        }
        if (!utils.isUndefined(options.fork)) {
          response.values = response.values.filter(filterByFork(options.fork));
        }
        return response;
      });
    },

    getSpecific: function (projectKey, repo, id, options) {
      if (!options) {
        options = {};
      }

      var clientOptions = { args: { 'state': options.state || 'OPEN' } };
      var path = 'projects/' + projectKey + '/repos/' + repo + '/pull-requests/' + id;

      return client.get(path, clientOptions).then(function(response) {
        return response;
      })
    },

    getCombined: function (projectKey, repo, options) {

      if (projectKey && repo) {
        return this.get(projectKey, repo, options);
      }
      else {

        var prsCombined = [];
        var API = this;

        // Find all repos matching projectKey/repo & return all PRs for each.
        return new Promise(function (resolve, reject) {
          // Find all repos.
          repos.getCombined(projectKey).then(function (reposResponse) {
            // Async loop.
            async.forEachOf(reposResponse.values, function (repo, index, callback) {
              API.get(repo.project.key, repo.slug, options).then(function (prResponse) {
                prsCombined = utils(prsCombined).concat(prResponse.values).value();
                callback();
              }).catch(function (err) {
                callback(err);
              });

            }, function (err) { // all PRs resolved.
              if (err) {
                reject(err);
              }
              else {
                resolve({ values: prsCombined });
              }
            });
          }).catch(function (err) {
            reject(err);
          });
        });
      }
    }
  }
};
