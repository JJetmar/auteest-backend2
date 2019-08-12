function errorHandler() {
  return async (ctx, next) => {
    // Error Handler
    try {
      await next();
    } catch (e) {
      const parameters = { ...e };
      delete parameters.message;
      delete parameters.name;
      const stack = parameters.stack;
      //delete parameters.stack;
      console.error(e);
      delete parameters.status;
      ctx.body = {
        error: e.message,
        parameters,
        stack
      };
      ctx.status = e.status || 500;
    }
  }
}

module.exports = errorHandler;