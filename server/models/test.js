const Mongoose = require('mongoose');
const createSchema = require('../core/create-schema');
const { schemaRepository }= require('../core/middlewares/validation-middleware');
const path = require('path');
const schemaPrefix = path.basename(__filename, '.js');

const objectSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1
    },
    httpMethod: {
      type: "string",
      enum: ["POST", "PUT", "DELETE"]
    },
    type: {
      type: "string",
      enum: ["soap", "rest"]
    },
    entitySchema: {
      type: "string"
    },
    endpoint: {
      type: "string"
    },
    seed: {
      type: "string"
    },
    soapTemplate: {
      type: "string"
    }
  },
  required: ["name", "entitySchema", "httpMethod", "endpoint"],
  additionalProperties: false
};

const onlyId = {
  type: "object",
  properties: {
    id: {
      type: "string",
      pattern: "[0-9a-f]{24}"
    }
  },
  additionalProperties: false
};

const objectSchemaWithId = {
  type: "object",
  properties: {
    ...objectSchema.properties,
    ...onlyId.properties
  },
  additionalProperties: false
};

const dataSchemas = {
  model: objectSchema,
  create: objectSchema,
  update: objectSchemaWithId,
  onlyId
};

const schemas = {};

Object.keys(dataSchemas).forEach(name => {
  schemas[name] = `${schemaPrefix}/${name}`;
  schemaRepository.addSchema(dataSchemas[name], schemas[name]);
});

const schema = createSchema();
schema.index({ "name": 1 }, { unique: true });

const model = Mongoose.model('test', schema);

module.exports = {
  schemas,
  model
};