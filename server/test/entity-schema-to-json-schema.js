const { entitySchemaToJsonSchema, getVariationList } = require("../utils/entity-schema-to-json-schema");

const input = {
  "id": "5d5f350d0edc7a04853b7a04",
  "attributes": [
    {
      "declaration": {
        "type": "string"
      },
      "name": "text",
      "parentId": null,
      "pseudoId": "c1188f80-c53d-11e9-970d-7f09a36042d0"
    },
    {
      "required": true,
      "declaration": {
        "type": "boolean"
      },
      "name": "Bulinek",
      "parentId": null,
      "pseudoId": "cc5e2670-c53d-11e9-970d-7f09a36042d0"
    },
    {
      "declaration": {
        "type": "number"
      },
      "name": "desetinne",
      "parentId": null,
      "pseudoId": "d47560d0-c53d-11e9-970d-7f09a36042d0"
    },
    {
      "declaration": {
        "type": "string"
      },
      "name": "New parameter 4",
      "parentId": null,
      "pseudoId": "fdff6180-c53d-11e9-970d-7f09a36042d0"
    }
  ],
  "name": "testik"
}

const expectedOutput = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "99",
  "type": "object",
  "properties": {
    "id": {
      "type": "integer"
    },
    "name": {
      "type": "string"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true
    }
  },
  "required": ["id", "name", "price"]
}

const table = getVariationList(input)[1];
console.log(JSON.stringify(table, null, 2));
const res = entitySchemaToJsonSchema(input, table);
console.log(JSON.stringify(res, null, 2));
/*
test('should convert entity Schema to JSON Schema', () => {
  expect(expectedOutput).toMatchObject(res);
});*/