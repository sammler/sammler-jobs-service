
Very simple, opinionated and re-usable service to log jobs to MongoDB:

- Save the state of jobs to MongoDB
- Update their status
- Retrieve the current state of a job
- Get the history of jobs

The jobs-service is responsible for

- Exposing a `/jobs` endpoint to get all current and archived jobs.
- Exposing endpoints to add/modify jobs.