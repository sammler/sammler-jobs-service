
_sammler-jobs-service_ can be configured by the following environment variables:

- `PORT` - The port to run the REST API (defaults to `3003`).

- `MONGOOSE_DEFAULTS_CREATED_AT` - TBD (defaults to `s5r_created_at`)
- `MONGOOSE_DEFAULTS_UPDATED_AT` - TBD (defaults to `s5r_updated_at`)

### Configuration for dependent services (in development mode)

- `SAMMLER_DB_JOBS_URI` - URI for the MongoDB Jobs database. Defaults to `mongodb://localhost:27017/jobs`

