
_jobs-service_ can be configured by the following environment variables:

**General:**

- `PORT` - The port to run the REST API (defaults to `3003`).
- `JWT_SECRET` - The secret used for JWT.
- `NODE_ENV` - Environment settings for the service (`production`, `development` or `test`), defaults to `development`.

**MongoDB:**

- `MONGODB_DEBUG` - Whether to use the Mongoose debug mode or not, defaults to `false`.
- `MONGODB_HOST` - MongoDB host, defaults to `localhost`.
- `MONGODB_PORT` - MongoDB port, defaults to `27017`. 
- `MONGODB_DATABASE` - The MongoDB database, defaults to `db`.

**NATS-Streaming:**

- `NATS_STREAMING_HOST` - The NATS-Streaming host, defaults to `localhost`.
- `NATS_STREAMING_PORT` - The NATS-Streaming port, defaults to `4222`.

**Behavior:**

- `ENABLE_AUDIT_LOG` - Whether to enable the audit log or not, can be `true` or `false`, defaults to `true`.

**Deprecated:**
- `LOAD_FROM_FILE` - All jobs will be loaded from a file, thus completely skipping MongoDB (defaults to false);
