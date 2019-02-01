const mongoose = require('mongoose');
const mongooseMaterializedPlugin = require('mongoose-materialized');

const MongooseConfig = require('../../config/mongoose-config');
const Schema = mongoose.Schema;

/* eslint-disable camelcase */
const schema = new Schema({

  _id: {
    type: Schema.Types.String,
    default: mongoose.Types.ObjectId
  },
  name: {
    type: Schema.Types.String,
    required: true
  },
  description: {
    type: Schema.Types.String,
    required: false
  },
  context: {
    type: Schema.Types.Object
  },
  // Todo: not sure about this, how would this help
  details: {
    type: Schema.Types.Object
  },
  status: {
    type: Schema.Types.String,
    enum: ['aborted', 'idle', 'running', 'timeout', 'completed'],
    default: 'idle'
  },
  frequency: {
    cron_def: {
      type: Schema.Types.String
    },
    comment: Schema.Types.String,
    comment_details: Schema.Types.String
  },
  last_execution: Schema.Types.Object

}, {
  collection: MongooseConfig.COLLECTION_PREFIX + MongooseConfig.COLLECTION_JOBS,
  strict: true,
  timestamps: {createdAt: MongooseConfig.FIELD_CREATED_AT, updatedAt: MongooseConfig.FIELD_UPDATED_AT}
});
/* eslint-enable camelcase */

// eslint-disable-next-line space-before-function-paren
// schema.virtual('job_id').get(function() {
//   return this._id;
// });

schema.plugin(mongooseMaterializedPlugin);

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
