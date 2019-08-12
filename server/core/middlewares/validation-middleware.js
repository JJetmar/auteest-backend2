const Ajv = require('ajv');
const ajv = new Ajv();
const handleIdIn = require('./id-in-middleware');

async function middleware(ctx, next) {
  const pseudoInput = ctx.request.body || ctx.params;
  const valid = await ajv.validate(ajv.getSchema(this).schema, pseudoInput);

  if (!valid) {
    ctx.throw(422, "Invalid input", { ...ajv.errors });
    return;
  }

  await handleIdIn(ctx, next);
}

const validation = (schema) => {
  return middleware.bind(schema);
};

module.exports = {
  validation,
  schemaRepository: ajv
};