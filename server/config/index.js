const serverConfig = require('./server')();
const databaseConfig = require('./database')();


module.exports = {
  server: serverConfig,
  database: databaseConfig
};
