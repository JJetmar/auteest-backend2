const Router = require('koa-router');
const TestControllers = require('../controllers/test');
const { schemas } = require('../models/test');
const { validation } = require('../core/middlewares/validation-middleware');

const {
  createTest,
  getTest,
  deleteTest,
  listTest,
  runTest
} = TestControllers;

const router = new Router({ prefix: '/api/test' });

router.post('/', validation(schemas.create), createTest);
router.put('/:id', validation(schemas.update), createTest);
router.delete('/:id', deleteTest);
router.get('/:id', getTest);
router.post('/:id/run', runTest);
router.get('/list/:pageIndex/:pageSize', listTest);

module.exports = router;
