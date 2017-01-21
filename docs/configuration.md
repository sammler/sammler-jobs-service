
_sammler-jobs-service_ can be configured by the following environment variables:

- `PORT` - The port to run the REST API (defaults to `3003`).

### Configuration for dependent services (in development mode)

- `SAMMLER_DB_JOBS_URI` - URI for the MongoDB Jobs database. Defaults to `mongodb://localhost:27117/jobs`

Note: MongoDB runs on port 27117 to prevent conflicts with running the entire _sammler_ development-environment at the same time.

