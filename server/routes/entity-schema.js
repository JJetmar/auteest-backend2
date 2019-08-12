const Router = require('koa-router');
const entitySchemaControllers = require('../controllers/entity-schema');
const { schemas } = require('../models/entity-schema');
const { validation } = require('../core/middlewares/validation-middleware');

const {
  createEntitySchema,
  getEntitySchema,
  deleteEntitySchema,
  listEntitySchema
} = entitySchemaControllers;

const router = new Router({ prefix: '/api/entity-schema' });

router.post('/', validation(schemas.create), createEntitySchema);
router.put('/:id', validation(schemas.update), createEntitySchema);
router.delete('/:id', deleteEntitySchema);
router.get('/:id', getEntitySchema);
router.get('/list/:pageIndex/:pageSize', listEntitySchema);

module.exports = router;
