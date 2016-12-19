const JobsModel = require('./jobs.model').Model;

class JobsBL {

  /**
   * Creates a new job.
   */
  static createOrUpdate( doc ) {

    const options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    };

    return JobsModel
      .findByIdAndUpdate(doc._id, doc, options)
      .exec();
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

}

module.exports = JobsBL;
