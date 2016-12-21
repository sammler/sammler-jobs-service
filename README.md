# sammler-jobs-service

> Job service for sammler.

## Purpose
Very simple, opinionated and re-usable service to log jobs to MongoDB in a microservices environment:

- Save the state of jobs & sub-jobs to MongoDB
- Update their status
- Retrieve the current state of a job
- Get the history of jobs

## Configuration
_sammler_jobs_service_ can be configured by the following environment variables:

- `API_PORT` - The port to run the REST API (defaults to `3003`).

- `MONGOOSE_DEFAULTS_CREATED_AT` - TBD (defaults to `s5r_created_at`)
- `MONGOOSE_DEFAULTS_UPDATED_AT` - TBD (defaults to `s5r_updated_at`)

## Author
**Stefan Walther**

* [github/stefanwalther](https://github.com/stefanwalther)
* [twitter/waltherstefan](http://twitter.com/waltherstefan)

## License
Released under the MIT license.

