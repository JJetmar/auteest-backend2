const Router = require('koa-router');
const TestResultsControllers = require('../controllers/test-result');

const {
  listTestResults,
  getTestResults,
  deleteTestResult
} = TestResultsControllers;

const router = new Router({ prefix: '/api/test-result' });
router.get('/list/:pageIndex/:pageSize', listTestResults);
router.get('/:id/', getTestResults);
router.delete('/:id', deleteTestResult);

module.exports = router;
