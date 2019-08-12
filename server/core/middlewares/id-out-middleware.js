const Mongoose = require("mongoose").Mongoose;

function handleIdOut() {
  return async (ctx, next) => {
    let result;
    if (Array.isArray(ctx.return)) {
      result = JSON.stringify(ctx.return);
    } else if (typeof ctx.return === "object") {
      if (ctx.return.constructor.base instanceof Mongoose) {
        result = ctx.return.toObject()
      } else {
        result = ctx.return;
      }
      // Change _id to id and set it to first position.
      const id = result._id;
      delete result._id;
      result = JSON.stringify({
        id, // id always first
        ...result
      });
    } else {
      result = JSON.stringify({ data: ctx.return });
    }

    ctx.body = JSON.parse(result.replace(/"_id"/g, `"id"`));
    await next();
  }
}

module.exports = handleIdOut;