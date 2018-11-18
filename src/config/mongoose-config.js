
module.exports = {
  debug: process.env.MONGODB_DEBUG || false,
  host: process.env.MONGODB_HOST || 'localhost',
  port: process.env.MONGODB_PORT || 27017,
  database: process.env.MONGODB_DATABASE || 'sammler',

  COLLECTION_PREFIX: 'jobs~~',

  FIELD_CREATED_AT: 's5r_created_at',
  FIELD_UPDATED_AT: 's5r_updated_at',

  COLLECTION_JOBS: 'jobs',
  COLLECTION_JOB_SPECS: 'job-specs'
};