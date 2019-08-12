const handleIdIn = async (ctx, next) => {
  if (ctx.request.rawBody && ctx.request.rawBody.includes(`"id"`)) {
    ctx.request.body = JSON.parse(ctx.request.rawBody.replace(/"id"/g, `"_id"`));
  }
  await next();
};

module.exports = handleIdIn;
