const mongoose = require('mongoose');
const mongooseMaterializedPlugin = require('mongoose-materialized');
const mongooseTimestampsPlugin = require('mongoose-timestamp');

const MongooseConfig = require('./../../config/mongoose-config');
const Schema = mongoose.Schema;

/* eslint-disable camelcase */
const schema = new Schema({

  job_id: Schema.Types.ObjectId,
  schedule: Schema.Types.Object,
  status: {
    type: Schema.Types.String,
    enum: ['aborted', 'idle', 'running', 'timeout', 'completed'],
    default: 'idle'
  }


}, {
  collection: MongooseConfig.COLLECTION_PREFIX + MongooseConfig.COLLECTION_JOBS,
  strict: true
});
/* eslint-enable camelcase */

// eslint-disable-next-line space-before-function-paren
schema.virtual('job_id').get(function() {
  return this._id;
});

schema.plugin(mongooseMaterializedPlugin);
schema.plugin(mongooseTimestampsPlugin, {createdAt: MongooseConfig.FIELD_CREATED_AT, updatedAt: MongooseConfig.FIELD_UPDATED_AT});

/**
 * Methods
 */
// ProfileSchema.method( {} );

/**
 * Statics
 */
// ProfileSchema.static( {} );

module.exports.Schema = schema;
module.exports.Model = mongoose.model(MongooseConfig.COLLECTION_JOBS, schema);
