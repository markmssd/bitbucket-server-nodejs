var assert = require('assert');
var sinon = require('sinon');
var BitbucketClient = require('../../index.js').Client;
var request = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');

describe('Repos', function () {
  var requestGet, bitbucketClient;
  var oauth = require('../mocks/oauth');

  // pagination mock
  var pageOne = require('../mocks/repos-pagination/page-1.json');
  var pageTwo = require('../mocks/repos-pagination/page-2.json');
  var pageThree = require('../mocks/repos-pagination/page-3.json');

  beforeEach(function () {
    bitbucketClient = new BitbucketClient('http://localhost/', oauth);
    requestGet = sinon.stub(request, 'get');
  });

  afterEach(function () {
    request.get.restore();
  });

  it('should get all the repos, using pagination', function (done) {
    // Mock the HTTP Client get.
    requestGet.onCall(0).returns(Promise.resolve(pageOne));
    requestGet.onCall(1).returns(Promise.resolve(pageTwo));
    requestGet.onCall(2).returns(Promise.resolve(pageThree));
    requestGet.onCall(3).throws();

    var options = {
      args: {
        limit: 100
      }
    };

    var EXPECTED = _.concat([], pageOne.values, pageTwo.values, pageThree.values);

    bitbucketClient.repos.getAll(options, [])
      .then(function (repos) {
        // Assert it contains the right ?start= argument
        assert.equal(requestGet.getCall(0).args[ 0 ].uri, 'http://localhost/repos?limit=100');
        assert.equal(requestGet.getCall(1).args[ 0 ].uri, 'http://localhost/repos?limit=100&start=1');
        assert.equal(requestGet.getCall(2).args[ 0 ].uri, 'http://localhost/repos?limit=100&start=2');

        assert.equal(_.isEqual(repos, EXPECTED), true);
        done();
      });
  });
});
