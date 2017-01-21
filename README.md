# sammler-jobs-service

> Job service for sammler.

[![CircleCI](https://img.shields.io/circleci/project/github/sammler/sammler-jobs-service.svg)](https://circleci.com/gh/sammler/sammler-jobs-service)

## Purpose
Very simple, opinionated and re-usable service to log hierarchical jobs to MongoDB:

- Save the state of jobs & sub-jobs to MongoDB
- Update their status
- Retrieve the current state of a job
- Get the history of jobs

## Configuration
_sammler-jobs-service_ can be configured by the following environment variables:

- `PORT` - The port to run the REST API (defaults to `3003`).

### Configuration for dependent services (in development mode)

- `SAMMLER_DB_JOBS_URI` - URI for the MongoDB Jobs database. Defaults to `mongodb://localhost:27117/jobs`

Note: MongoDB runs on port 27117 to prevent conflicts with running the entire _sammler_ development-environment at the same time.

## Author
**Stefan Walther**

* [github/stefanwalther](https://github.com/stefanwalther)
* [twitter/waltherstefan](http://twitter.com/waltherstefan)

## License
Released under the MIT license.

