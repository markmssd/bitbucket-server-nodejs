var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');

describe('Commits', function () {
  var requestGet, bitbucketClient;
  var oauth = require('../mocks/oauth');

  beforeEach(function () {
    bitbucketClient = new BitbucketClient('http://localhost/', oauth);
    requestGet = sinon.stub(request, 'get');
  });

  afterEach(function () {
    request.get.restore();
  });

  it('should get list of commits by repo', function (done) {
    // Mock the HTTP Client get.
    var expected = require('../mocks/commits.json');
    requestGet.returns(Promise.resolve(expected));

    // Test repos.get API.
    bitbucketClient.commits.get('PRJ', 'my-repo')
      .then(function (commits) {
        assert.equal(commits.size, 2);
        assert.deepEqual(commits.values[ 0 ], expected.values[ 0 ]);
        assert.equal(requestGet.getCall(0).args[ 0 ].uri, 'http://localhost/projects/PRJ/repos/my-repo/commits?limit=1000');

        done();
      });
  });
});
