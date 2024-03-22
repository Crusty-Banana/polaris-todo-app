const Router = require("koa-router");
const todoHandler = require("../handlers/todos/todoHandlers");
const todoInputMiddleware = require("../middleware/todoInputMiddleware");

const router = new Router();

router.get("/api/todos", todoHandler.getTodos);
router.get("/api/todos/:id", todoHandler.getTodo);
router.post("/api/todos", todoInputMiddleware, todoHandler.addTodo);
router.put("/api/todos/:id", todoHandler.updateTodo);
router.del("/api/todos/:id", todoHandler.deleteTodo);

router.options("/api/todos/:id", (ctx) => {
  ctx.set("Access-Control-Allow-Methods", "DELETE");
  ctx.status = 204; // No content response
});

module.exports = router;
