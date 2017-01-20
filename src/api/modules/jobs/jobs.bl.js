const JobsModel = require('./jobs.model').Model;
const _ = require('lodash');
const Promise = require('bluebird');
const mongoose = require('mongoose');

class JobsBL {

  /**
   * Creates a new job.
   */
  static save(docs) {
    if (!_.isArray(docs)) {
      return JobsBL.createSingle(docs);
    }
    return Promise.map(docs, item => JobsBL.createSingle(item));
  }

  static createSingle(job) {

    if (!job._id) {
      job._id = new mongoose.mongo.ObjectID();
    }
    let docModel = new JobsModel();
    docModel = _.merge(docModel, job); // Todo: why are we doing that?

    const valErrors = docModel.validateSync();
    if (valErrors) {
      throw new Error(valErrors);
    }

    return docModel.save();
  }

  // Todo: Don't use update because of mongoose-materialized
  static changeStatus(jobId, newStatus) {
    return JobsModel
      .update(
        {_id: jobId},
        {status: newStatus},
        {runValidators: true}
      );
  }

  /**
   * Returns the total amount of jobs (regardless their status).
   * @returns {Promise}
   */
  static count() {
    return JobsModel
      .count()
      .exec();
  }

  static getJobById(id) {
    return JobsModel
      .findById(id)
      .exec();
  }

  /**
   * Get all jobs.
   */
  static getJobs() {
    return JobsModel
      .find({})
      .exec();
  }

  static getJobsActive() {
    return JobsModel
      .find({})
      .exec();
  }

  static getJobsRunning() {
    return JobsModel
      .find({})
      .exec();
  }

  static getJobsFinished() {
    return JobsModel
      .find({})
      .exec();
  }

  // Todo: Don't use update because of mongoose-materialized
  static remove(id) {
    // Todo: Add check there that no parents with children are deleted
    return JobsModel
      .remove(id)
      .exec();
  }

  static removeAll() {
    return JobsModel
      .remove({})
      .exec();
  }

}

module.exports = JobsBL;
