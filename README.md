# jobs-service

> Job service for sammler.

[![CircleCI](https://img.shields.io/circleci/project/github/sammler/jobs-service.svg)](https://circleci.com/gh/sammler/jobs-service)
[![Codecov](https://img.shields.io/codecov/c/github/sammler/jobs-service.svg?logo=codecov)](https://codecov.io/gh/sammler/jobs-service)

## Purpose
Very simple, opinionated and re-usable service to get scheduled jobs into your stack.

On purpose this service wraps for now [agenda](https://github.com/agenda/agenda), but the interface of the service is generic enough to potentially move to another job-scheduler in the future.

## Configuration
_jobs-service_ can be configured by the following environment variables:

- `PORT` - The port to run the REST API (defaults to `3003`).
- `LOAD_FROM_FILE` - All jobs will be loaded from a file, thus completely skipping MongoDB (defaults to false);

### Configuration for dependent services (in development mode)

- `SAMMLER_DB_JOBS_URI` - URI for the MongoDB Jobs database. Defaults to `mongodb://localhost:27117/jobs`

Note: MongoDB runs on port 27117 to prevent conflicts with running the entire _sammler_ development-environment at the same time.

## Author
**Stefan Walther**

* [github/stefanwalther](https://github.com/stefanwalther)
* [twitter/waltherstefan](http://twitter.com/waltherstefan)

## License
MIT

