const yup = require("yup");

async function todoInputMiddleware(ctx, next) {
  try {
    const postData = ctx.request.body;
    let schema = yup.object().shape({
      text: yup.string().required(),
      isCompleted: yup.boolean().required(),
    });
    await schema.validate(postData);
    next();
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      error: e.errors,
      errorName: e.name,
    };
  }
}

module.exports = todoInputMiddleware;
