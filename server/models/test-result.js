const Mongoose = require('mongoose');
const createSchema = require('../core/create-schema');

const schema = createSchema();

const model = Mongoose.model('test-results', schema);

module.exports = {
  model
};