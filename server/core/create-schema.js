const Mongoose = require('mongoose');

const __setOptions = Mongoose.Query.prototype.setOptions;

Mongoose.Query.prototype.setOptions = function(options, overwrite) {
  __setOptions.apply(this, arguments);
  if (this.mongooseOptions().lean == null) { this.mongooseOptions({ lean: true }); }  return this;
};

const createSchema = () => {
  return new Mongoose.Schema({
  }, {
    strict: false,
    versionKey: false
  });
};

module.exports = createSchema;