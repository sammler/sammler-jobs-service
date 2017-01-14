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
      return JobsBL.saveSingle(docs);
    }
    return Promise.map(docs, item => JobsBL.save(item));
  }

  static saveSingle(doc) {
    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    };

    if (!doc._id) {
      doc._id = new mongoose.mongo.ObjectID();
    }
    let docModel = new JobsModel();
    docModel = _.merge(docModel, doc);

    const valErrors = docModel.validateSync();
    if (valErrors) {
      throw new Error(valErrors);
    }

    return JobsModel
      .findByIdAndUpdate(docModel._id, docModel, options)
      .exec();
  }

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

  static removeAll() {
    return JobsModel
      .remove({})
      .exec();
  }

}

module.exports = JobsBL;
