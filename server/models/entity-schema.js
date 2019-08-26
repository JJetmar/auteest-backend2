const Mongoose = require('mongoose');
const createSchema = require('../core/create-schema');
const { schemaRepository }= require('../core/middlewares/validation-middleware');
const EntitySchemaAttribute = require('./entity-schema-attribute');
const path = require('path');
const schemaPrefix = path.basename(__filename, '.js');

const objectSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      pattern: "^[a-zA-Z](-?[0-9a-zA-Z]+)*$",
      minLength: 1
    },
    description: {
      type: "string"
    },
    attributes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            pattern: "^[a-f0-9]{24}$"
          },
          pseudoId: {
            type: "string"
          },
          parentId: {
            type: ["string", "null"],
          },
          name: {
            type: "string",
            pattern: "^[a-zA-Z](-?[0-9a-zA-Z]+)*$",
            minLength: 1
          },
          description: {
            type: "string",
            default: ""
          },
          required: {
            type: "boolean",
            default: false
          },
          declaration: {
            type: "object",
            properties: {
              maxLength: {
                type: "number"
              },
              minLength: {
                type: "number"
              },
              regexp:  {
                type: "string"
              }
            }
          }
        },
        required: ['name', 'pseudoId'],
        additionalProperties: false
      }
    }
  },
  required: ["name"],
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

const model = Mongoose.model('entity-schema', schema);

module.exports = {
  schemas,
  model
};