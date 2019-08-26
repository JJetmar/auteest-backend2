const { model: EntitySchema } = require('../models/entity-schema');

const getAttributePath = (attribute, attributes) => {
  let currentAttribute = attribute;
  let path = [];
  while (currentAttribute) {
    path.push(currentAttribute.name);

    if (!currentAttribute.parentId) break;

    currentAttribute = attributes.find(attr => {
      return (attr.id || attr.pseudoId) === currentAttribute.parentId
    });
  }
  return path.reverse().join(".");
};

/**
 * createEntitySchema - crates entity Schema
 * @returns {EntitySchema} - created Entity Schema
 */
exports.createEntitySchema = async (ctx, next) => {
  const entitySchema = ctx.request.body;
  // update
  const id = ctx.params.id;
  const isUpdate = !!id;

  // Add pathname to attributes and check for attribute name uniqueness
  const entityAttributePaths = new Set();
  const duplicityNames = [];

  for (const entityAttribute of entitySchema.attributes) {
    // Set path of attribute like "entity.address.city"
    const entityAttributePath = getAttributePath(entityAttribute, entitySchema.attributes);

    if (!entityAttributePaths.has(entityAttributePath)) {
      entityAttributePaths.add(entityAttributePath);
    } else {
      duplicityNames.push(entityAttributePath);
    }
  }

  if (duplicityNames.length > 0) {
    ctx.throw(400, `There is a duplicity in name on attributes.`, { attributes: duplicityNames });
  }

  // Structure Validation
  let levelAttributes = entitySchema.attributes.filter(attr => !attr.parentId);
  do {
    const createdLevelAttributeIds = [];
    for (const entityAttribute of levelAttributes) {
      createdLevelAttributeIds.push(entityAttribute._id || entityAttribute.pseudoId);
      const isParent = entitySchema.attributes.some(attribute => attribute.parentId === (entityAttribute._id || entityAttribute.pseudoId));
      if (isParent && entityAttribute.declaration.type !== "object") {
        ctx.throw(400, `Declaration of type for parent attribute must be "object".`, { attributeName: entityAttribute.name });
      }
    }
    levelAttributes = entitySchema.attributes.filter(attr => createdLevelAttributeIds.includes(attr.parentId));
  } while (levelAttributes.length > 0);

  // Create/Update
  let es;
  if (isUpdate) {
    entitySchema._id = id;
  }
  es = new EntitySchema(entitySchema);

  if (isUpdate) {
    ctx.return = { data: await EntitySchema.findOneAndUpdate({_id: id}, {$set:entitySchema}, {new: true})};
  } else {
    ctx.return = await es.save();
  }

  await next();
};

/**
 * getEntitySchema - gets Entity schema
 * @returns {EntitySchema} - Entity Schema
 */
exports.getEntitySchema = async (ctx, next) => {
  const entitySchema = (await EntitySchema.findById(ctx.params.id));
  if (!entitySchema) {
    ctx.throw(400, `Entitydelete schema with specified id could not be found.`, { id: ctx.params.id });
    return
  }

  ctx.return = { data: entitySchema };
  await next();
};

/**
 * listEntitySchema - gets list of entity schemas
 * @returns {[EntitySchema]} - [Entity Schema]
 */
exports.listEntitySchema = async (ctx, next) => {
  const pageIndex = parseInt(ctx.params.pageIndex);
  const pageSize = parseInt(ctx.params.pageSize);

  const data = await EntitySchema.find({}, {}, { sort: {'_id': -1 }, skip: (pageIndex - 1) * pageSize, limit: pageSize });
  const total = await EntitySchema.count({});

  ctx.return = {
    data,
    total
  };
  await next();
};

/**
 * getEntitySchema - gets Entity schema
 * @returns {EntitySchema} - Entity Schema
 */
exports.deleteEntitySchema = async (ctx, next) => {
  const entitySchema = (await EntitySchema.findById(ctx.params.id));
  if (!entitySchema) {
    ctx.throw(400, `Entity schema with specified id could not be found.`, { id: ctx.params.id });
  }

  await EntitySchema.remove(entitySchema);

  ctx.return = entitySchema;
  await next();
};
