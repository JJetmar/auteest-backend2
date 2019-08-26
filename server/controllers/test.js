const { model: EntitySchema } = require('../models/entity-schema');
const { model: Test } = require('../models/test');
const { model: TestResult } = require('../models/test-result');
const { entitySchemaToJsonSchema, getVariationList } = require('../utils/entity-schema-to-json-schema');
const request = require('request');
const jsf = require("json-schema-faker");
const seedrandom = require('seedrandom');
const Mustache = require("mustache");

const alwaysPostForSoap = (test) => {
  console.log(test);
  if (test.type === "soap") {
    test.httpMethod = "POST"
  }
  return test;
};

const doTestRun = async (test, entitySchema, variation) => {
  const result = {};
  const requestJsonSchema = entitySchemaToJsonSchema(entitySchema, variation);
  const jsonInput = await jsf.resolve(requestJsonSchema, variation);

  const options = {
    url: test.endpoint,
    method: test.httpMethod,
    headers: {
      'Accept-Charset': 'utf-8',
      'User-Agent': 'autotest'
    }
  };

  if (test.type === "soap") {
    result.request = Mustache.render(test.soapTemplate, jsonInput);
    options['content-type'] = 'text/xml;charset=UTF-8';
    options['timeout'] = 5000;
  } else {
    // REST
    options['Accept'] = 'application/json';
    result.request = jsonInput;
    options.json = true;
  }

  options.body = result.request;

  const waitForResponse = new Promise(resolve => {
    result.start = new Date();
    request(options, function(err, res, body) {
      result.end = new Date();
      result.duration = result.end.getTime() - result.start.getTime();
      result.response = body || err;
      result.status = res ? res.statusCode : 500;
      result.valid = (!variation.includes("N") === result.status >= 200 && result.status < 300);
      resolve(result);
    });
  });
  return await waitForResponse;
};

/**
 * createTest- crates test
 * @returns {Test} - created Test
 */
exports.createTest = async (ctx, next) => {
  const test = alwaysPostForSoap(ctx.request.body);
  // update
  const id = ctx.params.id;
  const isUpdate = !!id;

  const es = new Test(test);

  if (isUpdate) {
    ctx.return = { data: await Test.findOneAndUpdate({_id: id}, {$set:test}, {new: true})};
  } else {
    ctx.return = await es.save();
  }

  await next();
};

/**
 * getTest- gets Test
 * @returns {Test} - Test
 */
exports.getTest= async (ctx, next) => {
  const test = (await Test.findById(ctx.params.id));
  if (!test) {
    ctx.throw(400, `Test with specified id could not be found.`, { id: ctx.params.id });
  }

  ctx.return = { data: test };
  await next();
};

/**
 * listTest- gets list of entity tests
 * @returns {[Test]} - [Test]
 */
exports.listTest = async (ctx, next) => {
  const pageIndex = parseInt(ctx.params.pageIndex);
  const pageSize = parseInt(ctx.params.pageSize);

  const data = await Test.find({}, {}, { sort: {'_id': -1 }, skip: (pageIndex - 1) * pageSize, limit: pageSize });
  const total = await Test.count({});

  ctx.return = {
    data,
    total
  };
  await next();
};

/**
 * getTest- gets Test
 * @returns {Test} - Test
 */
exports.deleteTest= async (ctx, next) => {
  const test = (await Test.findById(ctx.params.id));
  if (!test) {
    ctx.throw(400, `Test with specified id could not be found.`, { id: ctx.params.id });
  }

  await Test.remove(test);

  ctx.return = test;
  await next();
};

/**
 * runTest- runs Test
 * @returns {Test} - Test
 */
exports.runTest = async (ctx, next) => {
  const test = (await Test.findById(ctx.params.id));
  if (!test) {
    ctx.throw(400, `Test with specified id could not be found.`, { id: ctx.params.id });
    return;
  }

  const entitySchema = (await EntitySchema.findById(test.entitySchema));
  if (!entitySchema ) {
    ctx.throw(400, `Entity Schema to specified test could not be found.`, { entitySchemaId: test.entitySchema});
    return;
  }

  const variationList = getVariationList(entitySchema);

  const testResult = {
    start: new Date(),
    results: []
  };

  if (test.seed) {
    jsf.option({
      random: seedrandom(test.seed)
    });
  }

  for (let i = 0; i < variationList.length; i++) {
    const currentVariation = variationList[i];
    await doTestRun(test, entitySchema, currentVariation);
    testResult.results.push(await doTestRun(test, entitySchema, currentVariation));
  }
  testResult.end = new Date();
  testResult.duration = testResult.end.getDate() - testResult.start.getDate();
  const restResulty = await new TestResult(testResult);

  ctx.return = await restResulty.save();
  await next();
};

