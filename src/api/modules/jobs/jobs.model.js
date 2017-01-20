const mongoose = require('mongoose');
const mongooseMaterializedPlugin = require('mongoose-materialized');
const mongooseTimestampsPlugin = require('mongoose-timestamp');

const MongooseConfig = require('./../../config/mongoose-config');
const Schema = mongoose.Schema;

/* eslint-disable camelcase */
const schema = new Schema({
  _id: {
    type: String,
    default: new Schema.ObjectId().toString()
  },
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['aborted', 'idle', 'running', 'timeout', 'completed'],
    default: 'idle'
  },
  details: {
    type: Object
  }

}, {
  collection: MongooseConfig.COLLECTION_PREFIX + MongooseConfig.COLLECTION_JOBS,
  strict: true
});
/* eslint-enable camelcase */

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
