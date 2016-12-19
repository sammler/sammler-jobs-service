const mongoose = require('mongoose');
const bluebird = require('bluebird');

let instance;
class Context {
  constructor() {
    this.db = null;
    mongoose.Promise = bluebird;

    if (!this.db) {
      this.dbConnect();
    }
  }

  static instance() {
    if (!instance) {
      instance = new Context();
    }
    return instance;
  }

  dbConnect() {
    const uri = 'mongodb://localhost:27017/jobs';
    const options = {};
    this.db = mongoose.connect(uri, options);
  }

  dbDisconnect() {
    if (this.db) {
      this.db.disconnect();
    }
  }
}

module.exports = Context;

