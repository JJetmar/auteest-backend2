export default {

  entitySchemaGet: '/entity-schema/:id',
  entitySchemaList: '/entity-schema/list/:page/:pageSize',
  entitySchemaUpdate: 'PUT /entity-schema/:id',
  entitySchemaCreate: 'POST /entity-schema',
  entitySchemaDelete: 'DELETE /entity-schema/:id',

  testGet: '/test/:id',
  testRun: 'POST /test/:id/run',
  testList: '/test/list/:page/:pageSize',
  testUpdate: 'PUT /test/:id',
  testCreate: 'POST /test',
  testDelete: 'DELETE /test/:id',

  testResultsGet: '/test-result/:id',
  testResultsList: '/test-result/list/:page/:pageSize',
  testResultsDelete: 'DELETE /test-result/:id',
};
