const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function getAll({ limit, orderBy }) {
  let todos = await db.collection("todos").get();
  todos = todos.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  if (orderBy) {
    if (orderBy === "desc") {
      todos.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }
    if (orderBy === "asc") {
      todos.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    }
  }
  if (limit) {
    todos = todos.slice(0, limit);
  }
  return todos;
}

async function getOne({ id, fields }) {
  const todo = (await db.collection("todos").doc(id.toString()).get()).data();
  if (todo) {
    const fieldsArray = fields ? fields.split(",") : Object.keys(todo);
    let requestedTodo = {};
    fieldsArray.forEach((key) => {
      requestedTodo[key] = todo[key];
    });
    return requestedTodo;
  }
  throw new Error("Todo not found with that id!");
}

async function add(data) {
  try {
    await db.collection("todos").add(data);
    return data;
  } catch (e) {
    console.log("Failure to add todos", e);
  }
}

async function change(id, data) {
  const todo = (await db.collection("todos").doc(id.toString()).get()).data();
  console.log(data, todo, { ...todo, ...data });
  await db
    .collection("todos")
    .doc(id.toString())
    .set({ ...todo, ...data });
  return data;
}

async function remove(id) {
  await db.collection("todos").doc(id.toString()).delete();
  return;
}

async function deleteAllData() {
  await db
    .collection("todos")
    .listDocuments()
    .then((val) => {
      val.map((val) => {
        val.delete();
      });
    });
}
module.exports = {
  db,
  getOne,
  getAll,
  add,
  change,
  remove,
  deleteAllData,
};
