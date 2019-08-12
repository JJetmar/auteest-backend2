export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user',
  logoutUser: '/user/logout',
  loginUser: 'POST /user/login',

  queryUser: '/user/:id',

  entitySchemaGet: '/entity-schema/:id',
  entitySchemaList: '/entity-schema/list/:page/:pageSize',
  entitySchemaUpdate: 'PUT /entity-schema/:id',
  entitySchemaCreate: 'POST /entity-schema',
  entitySchemaDelete: 'DELETE /entity-schema/:id',

  queryUserList: '/users',
  updateUser: 'Patch /user/:id',
  createUser: 'POST /user',
  removeUser: 'DELETE /user/:id',
  removeUserList: 'POST /users/delete',

  queryPostList: '/posts',

  queryDashboard: '/dashboard',
};
