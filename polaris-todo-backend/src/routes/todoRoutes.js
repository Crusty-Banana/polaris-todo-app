const Router = require("koa-router");
const todoHandler = require("../handlers/todos/todoHandlers");
const todoInputMiddleware = require("../middleware/todoInputMiddleware");

const router = new Router();

router.get("/api/todos", todoHandler.getTodos);
router.get("/api/todo/:id", todoHandler.getTodo);
router.post("/api/todos", todoInputMiddleware, todoHandler.addTodo);
router.put("/api/todo/:id", todoHandler.updateTodo);
router.del("/api/todo/:id", todoHandler.deleteTodo);

router.options("/api/todo/:id", (ctx) => {
  ctx.set("Access-Control-Allow-Methods", "DELETE");
  ctx.status = 204; // No content response
});

module.exports = router;
