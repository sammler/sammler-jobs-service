const mongoose = require('mongoose');
const mongooseMaterializedPlugin = require('mongoose-materialized');
const mongooseTimestampsPlugin = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const MongooseConfig = require('../../config/mongoose-config');
const schema = new Schema({
  name: Schema.Types.String,
  description: Schema.Types.String,
  owner_id: Schema.Types.String,
  start_date: Schema.Types.Date,
  end_date: Schema.Types.Date,
  command: Schema.Types.Object
}, {
  collection: MongooseConfig.COLLECTION_PREFIX + MongooseConfig.COLLECTION_JOBS,
  strict: true
});

schema.plugin(mongooseMaterializedPlugin);
schema.plugin(mongooseTimestampsPlugin, {createdAt: MongooseConfig.FIELD_CREATED_AT, updatedAt: MongooseConfig.FIELD_UPDATED_AT});

module.exports.Schema = schema;
module.exports.Model = mongoose.model(MongooseConfig.COLLECTION_JOB_SPECS, schema);
