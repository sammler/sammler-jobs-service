const JobsModel = require('./jobs.model').Model;

class JobsBL {

  /**
   * Creates a new job.
   */
  static createOrUpdate( doc ) {

    let options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    };

    return JobsModel
      .findByIdAndUpdate( doc._id, doc, options)
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
