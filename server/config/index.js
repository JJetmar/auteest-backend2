const serverConfig = require('./server')();
const databaseConfig = require('./database')();
const emailConfig = require('./email')();


module.exports = {
  server: serverConfig,
  database: databaseConfig,
  email: emailConfig
};
