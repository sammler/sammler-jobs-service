const mongoose = require('mongoose');

const MongooseConfig = require('./../../config/mongoose-config');

const Schema = mongoose.Schema;

const schema = new Schema({
  jobs_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  tenant_id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  processor: {
    type: String,
    required: true
  },
  job_identifier: {
    type: String,
    required: true
  },
  succeeded: {
    type: Boolean,
    required: true
  },
  failed_error: {
    type: Object
  },
  executed_at: {
    type: Date,
    required: true
  },
  data: {
    type: Object
  }
}, {
  collection: MongooseConfig.COLLECTION_PREFIX + MongooseConfig.COLLECTION_JOBS_HISTORY,
  strict: true,
  timestamps: {createdAt: MongooseConfig.FIELD_CREATED_AT, updatedAt: MongooseConfig.FIELD_UPDATED_AT}
});

const model = mongoose.model(MongooseConfig.COLLECTION_JOBS_HISTORY, schema);

module.exports = {
  Schema: schema,
  Model: model
};
