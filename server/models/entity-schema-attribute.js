const Mongoose = require('mongoose');
const { schemaRepository } = require('../core/middlewares/validation-middleware');
const createSchema = require('../core/create-schema');
const path = require('path');

const schemaPrefix = path.basename(__filename, '.js')

const objectSchema = {
  type: 'object',
  $defs: {
    schemaArray: {
      type: "array",
      minItems: 1,
      items: { $recursiveRef: "#" }
    },
    nonNegativeInteger: {
      type: "integer",
      minimum: 0
    },
    nonNegativeIntegerDefault0: {
      $ref: "#/$defs/nonNegativeInteger",
      default: 0
    },
    simpleTypes: {
      enum: [
        "array",
        "boolean",
        "integer",
        "null",
        "number",
        "object",
        "string",
        "reference"
      ]
    },
    stringArray: {
      type: "array",
      items: { "type": "string" },
      uniqueItems: true,
      default: []
    }
  },
  properties: {
    description: {
      type: "string"
    },
    readOnly: {
      type: "boolean",
      default: false
    },
    multipleOf: {
      type: "number",
      exclusiveMinimum: 0,
      minimum: 0
    },
    maximum: {
      type: "number"
    },
    exclusiveMaximum: {
      type: "number"
    },
    minimum: {
      type: "number"
    },
    exclusiveMinimum: {
      type: "number"
    },
    maxLength: { "$ref": "#/$defs/nonNegativeInteger" },
    minLength: { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
    pattern: {
      type: "string",
      format: "regex"
    },
    additionalItems: { "$recursiveRef": "#" },
    items: {
      anyOf: [
        { "$recursiveRef": "#" },
        { "$ref": "#/$defs/schemaArray" }
      ]
    },
    maxItems: { "$ref": "#/$defs/nonNegativeInteger" },
    minItems: { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
    uniqueItems: {
      type: "boolean",
      default: false
    },
    contains: { "$recursiveRef": "#" },
    maxContains: { "$ref": "#/$defs/nonNegativeInteger" },
    minContains: {
      $ref: "#/$defs/nonNegativeInteger",
      default: 1
    },
    maxProperties: { "$ref": "#/$defs/nonNegativeInteger" },
    minProperties: { "$ref": "#/$defs/nonNegativeIntegerDefault0" },
    required: { "$ref": "#/$defs/stringArray" },
    additionalProperties: { "$recursiveRef": "#" },
    properties: {
      type: "object",
      additionalProperties: { "$recursiveRef": "#" },
      default: {}
    },
    patternProperties: {
      type: "object",
      additionalProperties: { "$recursiveRef": "#" },
      propertyNames: { "format": "regex" },
      default: {}
    },
    dependentSchemas: {
      type: "object",
      additionalProperties: {
        $recursiveRef: "#"
      }
    },
    dependentRequired: {
      type: "object",
      additionalProperties: {
        $ref: "#/$defs/stringArray"
      }
    },
    dependencies: {
      $comment: "\"dependencies\" is no longer a keyword, but schema authors should avoid redefining it to facilitate a smooth transition to \"dependentSchemas\" and \"dependentRequired\"",
      type: "object",
      additionalProperties: {
        anyOf: [
          { "$recursiveRef": "#" },
          { "$ref": "#/$defs/stringArray" }
        ]
      }
    },
    propertyNames: { "$recursiveRef": "#" },
    const: {
      type: "string"
    },
    enum: {
      type: "array",
      items: {
        type: "string"
      },
      minItems: 1,
      uniqueItems: true
    },
    type: {
      anyOf: [
        { "$ref": "#/$defs/simpleTypes" },
        {
          type: "array",
          items: { "$ref": "#/$defs/simpleTypes" },
          minItems: 1,
          uniqueItems: true
        }
      ]
    },
    format: { "type": "string" },
    contentMediaType: { "type": "string" },
    contentEncoding: { "type": "string" },
    if: { "$recursiveRef": "#" },
    then: { "$recursiveRef": "#" },
    else: { "$recursiveRef": "#" },
    allOf: { "$ref": "#/$defs/schemaArray" },
    anyOf: { "$ref": "#/$defs/schemaArray" },
    oneOf: { "$ref": "#/$defs/schemaArray" },
    not: { "$recursiveRef": "#" }
  },
  required: ['type'],
  additionalProperties: false
};

const dataSchemas = {
  model: objectSchema
};

const schemas = {};

Object.keys(dataSchemas).forEach(name => {
  schemas[name] = `${schemaPrefix}/${name}`;
  schemaRepository.addSchema(dataSchemas[name], schemas[name]);
});

const schema = createSchema();

const model = Mongoose.model('entity-schema-attribute', schema);

module.exports = {
  schemas,
  model
};