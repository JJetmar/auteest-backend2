// Converts entity schema to JSON schema
const VALID = 'V';
const NONVALID = 'N';
const UNFILLED = '0';

const getVariationList = (entitySchema) => {
  const variations = [];
  for (const attr of entitySchema.attributes) {
    if (attr.required) { variations.push(['V', 'N']); } else {
      variations.push(['V', 'N', '0']);
    }
  }

  let result = variations[0].map(item => [item]);

  for (let k = 1; k < variations.length; k++) {
    const next = [];
    result.forEach((item) => {
      variations[k].forEach((word) => {
        const line = item.slice(0);
        line.push(word);
        next.push(line);
      });
    });
    result = next;
  }
  return result;
};

const entitySchemaToJsonSchema = (entitySchema, variation) => {
  if (!variation) {
    // Default is everything valid
    variation = [...new Array(entitySchema.attributes.length)].map(() => 'V');
  }

  const localVariation = [...variation];

  const jsonSchema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    title: entitySchema.name,
    type: 'object',
    properties: {

    },
  };

  const getTree = (jsonElParent, parentId = null) => {
    const childrenElements = entitySchema.attributes.filter(attr => attr.parentId == parentId)
      .map(el => [jsonElParent, el]);

    while (childrenElements.length > 0) {
      const elementPair = childrenElements.shift();
      const element = elementPair[1];
      const jsonParent = elementPair[0];
      const state = localVariation[entitySchema.attributes.indexOf(element)];

      if (!jsonParent.properties) {
        jsonParent.properties = {};
      }

      jsonParent.properties[element.name] = {
        type: element.declaration.type,
      };

      // required?
      let willBeDefined = true;
      switch (state) {
        case VALID:
        case NONVALID:
          willBeDefined = true;
          break;
        case UNFILLED:
          willBeDefined = false;
      }

      if (willBeDefined) {
        if (!jsonParent.required) {
          jsonParent.required = [];
        }
        jsonParent.required.push(element.name);

        if (state === NONVALID) {
          const declaration = element.declaration;
          switch (declaration.type) {
            case 'string':
              if (declaration.minLength > 1) {
                declaration.maxLength = declaration.minLength - 1;
                declaration.minLength = 1;
              } else {
                declaration.type = 'number';
              }
              break;
            case 'number':
            case 'integer':
              const minimum = declaration.minimum;
              const maximum = declaration.maximum;
              if (minimum) {
                declaration.maximum = minimum;
                declaration.minimum -= 1000;
              } else if (maximum) {
                declaration.minimum = maximum;
                declaration.maximum += 1000;
              } else {
                declaration.type = 'string';
              }
              break;
            case 'boolean':
              declaration.type = 'string';
              break;
            default:
          }
          // intnernally fake it as valid
          localVariation[entitySchema.attributes.indexOf(element)] = "V";
        }
      }

      jsonParent.properties[element.name] = {
        ...jsonParent.properties[element.name],
        ...element.declaration
      };

        const moreChildren = entitySchema.attributes.filter(attr => attr.parentId === element.pseudoId)
        .map((el) => {
          if (!jsonParent.properties) {
            jsonParent.properties = {};
          }
          return [jsonParent.properties[element.name], el.decla];
        },
      );
      for (const children of moreChildren) {
        childrenElements.unshift(children);
      }
    } while (childrenElements.length);

    return jsonSchema;
  };

  return getTree(jsonSchema);
};
module.exports = {
  entitySchemaToJsonSchema,
  getVariationList,
};
