const {
  getAll: getAllTodos,
  getOne: getOneTodo,
  add: addOneTodo,
  change: updateOneTodo,
  remove: deleteOneTodo,
} = require("../../databases/todoRepository");
//TODO: add loading, add disable action, filter api call, add loading button and disable other actions, change to incomplete when complete, add sort by createdAt, add error when field is empty
// change layout to block stack or something
async function getTodos(ctx) {
  try {
    const todos = await getAllTodos(ctx.request.query);
    ctx.body = {
      data: todos,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      data: [],
      error: e.message,
    };
  }
}

async function getTodo(ctx) {
  try {
    const { id } = ctx.params;
    const { fields } = ctx.request.query;
    const todo = await getOneTodo({ id, fields });
    return (ctx.body = {
      data: todo,
    });
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
}

async function addTodo(ctx) {
  try {
    const todo = ctx.request.body;
    await addOneTodo(todo);
    ctx.status = 201;
    return (ctx.body = {
      success: true,
    });
  } catch (e) {
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
}

async function updateTodo(ctx) {
  try {
    const { id } = ctx.params;
    const todo = ctx.request.body;
    await updateOneTodo(id, todo);
    ctx.body = {
      success: true,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
}

async function deleteTodo(ctx) {
  try {
    const { id } = ctx.params;
    await deleteOneTodo(id);
    ctx.body = {
      success: true,
    };
  } catch (e) {
    ctx.status = 404;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
}

module.exports = {
  getTodos,
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo,
};
