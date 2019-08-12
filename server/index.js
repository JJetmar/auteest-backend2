const Koa = require('koa');
const mongoose = require('mongoose');
const cors = require('kcors');
const bodyParser = require('koa-bodyparser');
const routes = require('./routes');
const config = require('./config');
const errorHandler = require('./core/middlewares/error-middleware');
const handleIdOut = require('./core/middlewares/id-out-middleware');

// Make mongoose use native ES6 promises
mongoose.Promise = global.Promise;

const wait = (millis) => new Promise(resolve => setTimeout(resolve, millis));

// Connect to MongoDB
try {
  mongoose.connect(config.database.url, config.database.opts).catch(r => {
    console.log("REJECTED");
    console.log(r);
  });
} catch (e) {
  console.error(e);
}


const app = new Koa();
app
  .use(cors())
  .use(errorHandler())
  .use(bodyParser())
  .use(routes)
  .use(handleIdOut());

app.listen(config.server.port);

process.on('SIGINT', () => {

  console.log("App closed.");
  process.exit(1);
});

