const express = require('express');
const bodyParser = require('body-parser');

const { Validator, ValidationError } = require('express-json-validator-middleware');

const validator = new Validator({allErrors: true});
const validate = validator.validate;

// Define a validation JSON Schema
const testSchema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 20
    },
    cardId: {
      type: 'string'
    },
    age: {
      type: 'integer'
    },
    active: {
      type: "boolean"
    }
  }
};

const app = express();

app.use(bodyParser.json());

// This route validates req.body against the testSchema
app.post('/test-endpoint/', validate({body: testSchema}), function(req, res) {
  const result = {
    name: req.body.name,
    // business mistake
    // Unhandled undefined value for cardId
    cardId: req.body.cardId.toUpperCase(), // wrong implementation
    // cardId: req.body.cardId ? req.body.cardId.toUpperCase() : null, // better implementation
    age: req.body.cardId,
    active: req.body.active || false
  };
  res.send(result);
});

// Error handler for validation errors
app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(400);
    res.send(JSON.stringify(err, null, 2));
    next();
  } else if (res && Object.keys(res).length) {
    console.error(err)
    res.status(400);
    res.send({
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    next();
  }
  else next(err);
});

app.listen(4000, () => console.log(`Test server listening on port 4000!`));