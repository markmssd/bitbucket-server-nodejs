'use strict';

module.exports = function (client) {
  return {
    get: function (projectKey, repoKey, options) {
      return client.getCollection('projects/' + projectKey + '/repos/' + repoKey + '/commits', options);
    }
  };
};