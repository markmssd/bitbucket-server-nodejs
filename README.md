
# Rest client for Atlassian client

Provides access to *some* of client's APIs.

[![Build Status](https://travis-ci.org/markmssd/bitbucket-server-nodejs.svg?branch=master)](https://travis-ci.org/markmssd/bitbucket-server-nodejs)
[![Coverage Status](https://coveralls.io/repos/github/markmssd/bitbucket-server-nodejs/badge.svg?branch=master)](https://coveralls.io/github/markmssd/bitbucket-server-nodejs?branch=master)

[![npm package](https://nodei.co/npm/bitbucket-server-nodejs.png?downloads=true&downloadRank=true)](https://nodei.co/npm/bitbucket-server-nodejs/)

## Installation
```
npm install bitbucket-server-nodejs
```

## Initializing Client
Supports public, basic auth (either with username/password, or [Personal Access Tokens](https://confluence.atlassian.com/bitbucketserver/personal-access-tokens-939515499.html)) and OAuth1.

Specify auth's type as 'public', 'basic' or 'oauth'. Defaults to 'public'.

```
var Client = require('bitbucket-server-nodejs').Client;
```

```
                 - BASIC AUTH -
var auth = {
    "type": "basic",
    "username": "username",
    "password": "password"
};

       - OR BASIC AUTH WITH PERSONAL ACCESS TOKEN -
var auth = {
    "type": "basic",
    "bearer": "bearer",
};

                  - OR OAUTH1 -
var auth = {
    "type": "oauth",
    "consumer_secret": "consumer_secret",
    "signature_method": "signature_method",
    "token": "token",
    "token_secret": "token_secret"
};
      - OR NO AUTH AT ALL, FOR PUBLIC ACCESS -
```

```
var client = new Client('http://localhost:7990/rest/api/1.0');
                      - OR -
var client = new Client('http://localhost:7990/rest/api/1.0', auth);
```

## APIS

### projects

Get all projects.

```
client.projects.get(); // Promise
```

### repos

Get all repos for a project.

```
client.repos.get(projectKey); // Promise
```

Get all repos, using pagination.

```
client.repos.getAll(); // Promise
```

Get all repos for all projects.

```
client.repos.getCombined(); // Promise
```

Get one repo for a project.

```
client.repos.getRepo(projectKey, repo); // Promise
```

### branches

Get all branches for a repo.

```
client.branches.get(projectKey, repoKey); // Promise
```

To get branches from a user repo rather than a project repo, use user's slug as the project key, prepended by '~'.

```
client.branches.get('~userslug', repoKey); // Promise
```

### tags

Get all tags for a repo.

```
client.tags.get(projectKey, repoKey); // Promise
```

To get tags from a user repo rather than a project repo, use user's slug as the project key, prepended by '~'.

```
client.tags.get('~userslug', repoKey); // Promise
```

### pull requests

Get a specific pull request.

```
client.prs.getSpecific(projectKey, repoSlug, id); // Promise
```

Get all pull requests for a repo.

```
client.prs.get(projectKey, repoSlug); // Promise
```

Get all pull requests for a project.

```
client.prs.getCombined(projectKey); // Promise
```

Get all pull requests on all projects.

```
client.prs.getCombined(); // Promise
```

Get all pull requests by a specific author.

```
client.prs.getCombined(null, null, { author: "ben" }); // Promise
```

Get all pull requests in a specific state (defaults OPEN).

```
client.prs.getCombined(null, null, { state: "MERGED" }); // Promise
```

*Possible states: ALL, OPEN, DECLINED or MERGED.*

### hooks

Get all hooks for a repo.

```
client.hooks.get(projectKey, repoSlug); // Promise
```

Get all pre-recieve hooks.

```
client.hooks.getPreReceive(projectKey, repoSlug); // Promise
```

Get all post-recieve hooks.

```
client.hooks.getPostReceive(projectKey, repoSlug); // Promise
```

Get details for a single hook.

```
client.hooks.getHook(projectKey, repoSlug, hookKey); // Promise
```

### settings

Get user's settings. Username and Password must be valid.

```
client.settings.get(username); // Promise
```

### users

Get full list of users. You will probably need to have admin access.

```
client.users.get(); // Promise
```

Get one user.

```
client.users.getUser(userSlug); // Promise
```

## API Coverage

 - /rest/api/1.0/users [GET]
 - /rest/api/1.0/users/{userSlug} [GET]
 - /rest/api/1.0/users/{userSlug}/settings [GET]
 - /rest/api/1.0/projects [GET]
 - /rest/api/1.0/projects/{projectKey}/repos [GET]
 - /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug} [GET]
 - /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/browse [GET]
 - /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/branches [GET]
 - /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests [GET]
 - /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/hooks [GET]
 - /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/hooks/{hookKey}/enabled [PUT]
 - /rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/tags [GET]
