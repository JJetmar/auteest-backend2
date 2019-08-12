const { MongoClient } = require('mongodb');

const defaultOptions = {
  useNewprlParser: true,
  autoReconnect: true,
  poolSize: 10
};

let mongoClient;
let mongoDb;

export function connect(url, options, cb) {
  if (mongoClient) return cb(undefined);

  options = options && Object.keys(options).length ? options : defaultOptions;

  console.log(options);

  MongoClient.connect(
    url,
    options,
    (err, c) => {
      if (!err && c) {
        mongoClient = c;
        return cb(undefined);
      } else return cb(err);
    }
  );
}

export function disconnect() {
  if (mongoClient) return mongoClient.close();
}

export function db(name) {
  if (mongoDb) return mongoDb;
  if (mongoClient) {
    mongoDb = mongoClient.db(name); return mongoDb;
  } else return undefined;
}

export function collection(collectionName) {
  return mongoDb.collection(collectionName)
}
