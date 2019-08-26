const { model: TestResult } = require('../models/test-result');

/**
 * testResult - gets Test Result
 * @returns {[TestResult]} - [Test Result]
 */
exports.getTestResults = async (ctx, next) => {
  const itemId = ctx.params.id;

  const data = await TestResult.findOne({ _id: itemId });

  ctx.return = {
    data
  };
  await next();
};

/**
 * testResult - gets list of Test Result
 * @returns {[TestResult]} - [Test Result]
 */
exports.listTestResults = async (ctx, next) => {
  const pageIndex = parseInt(ctx.params.pageIndex);
  const pageSize = parseInt(ctx.params.pageSize);

  const data = await TestResult.find({}, { results: 0 }, { sort: {'_id': -1 }, skip: (pageIndex - 1) * pageSize, limit: pageSize });
  const total = await TestResult.count({});

  ctx.return = {
    data,
    total
  };
  await next();
};


/**
 * testResult - deletes Test Result
 * @returns {EntitySchema} - Test Result
 */
exports.deleteTestResult = async (ctx, next) => {
  const testResult = (await TestResult.findById(ctx.params.id));
  if (!testResult) {
    ctx.throw(400, `Test Result with specified id could not be found.`, { id: ctx.params.id });
  }

  await TestResult.remove(testResult);

  ctx.return = testResult;
  await next();
};
