const jsf = require("json-schema-faker");
const seedrandom = require('seedrandom');

const { entitySchemaToJsonSchema } = require("../utils/entity-schema-to-json-schema");
const Ajv = require('ajv');
const EntitySchema = require("../models/entity-schema").model;

const generateMongoId = () => {
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

const validate = (schema, data) => {
  const ajv = new Ajv({coerceTypes: 'array'});
  const validate = ajv.compile(schema);
  return validate(data);
};

exports.publicRestApiCreate = async (ctx, next) => {
  const entityName = ctx.params.entity;
  const entitySchema = (await EntitySchema.findOne({ name: entityName}));

  if (!entitySchema) {
    ctx.throw(404, `Public REST API for referenced source could not be found.`, { source: entityName });
    return;
  }
  const jsonSchema = entitySchemaToJsonSchema(entitySchema);

  const result = await jsf.resolve(jsonSchema);

  ctx.return = { ...result, id: (ctx.params.id || generateMongoId()) };
  await next();
};

exports.publicRestApiGet = async (ctx, next) => {
  const entityName = ctx.params.entity;
  const entityId = ctx.params.id;
  const entitySchema = (await EntitySchema.findOne({ name: entityName}));

  if (!entitySchema) {
    ctx.throw(404, `Public REST API for referenced source could not be found.`, { id: entityName });
    return;
  }

  const jsonSchema = entitySchemaToJsonSchema(entitySchema);

  jsf.option({
    random: seedrandom(entityId)
  });
  const result = await jsf.resolve(jsonSchema);

  ctx.return = { ...result, id: entityId };
  await next();
};