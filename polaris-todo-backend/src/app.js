const Koa = require("koa");
const KoaBody = require("koa-body");
const todoRouter = require("./routes/todoRoutes");
const cors = require("@koa/cors");

const app = new Koa();

app.use(cors());
app.use(KoaBody());
app.use(todoRouter.routes());
app.use(todoRouter.allowedMethods());

app.listen(5000);
