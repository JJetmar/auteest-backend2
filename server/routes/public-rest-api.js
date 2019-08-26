const Router = require('koa-router');
const RestApiControllers = require('../controllers/rest-api');

const {
  publicRestApiCreate,
  publicRestApiGet
} = RestApiControllers;

const router = new Router({ prefix: '/public-api' });

router.post('/:entity/', publicRestApiCreate);
router.put('/:entity/:id', publicRestApiCreate);
router.delete('/:entity/:id', publicRestApiGet);
router.get('/:entity/:id', publicRestApiGet);



module.exports = router;
