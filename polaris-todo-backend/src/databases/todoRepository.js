const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const ref = db.collection("todos");

async function getAll({ limit, orderBy }) {
  let todos = await ref
    .orderBy("text", orderBy)
    .limit(Number(limit) || 10)
    .get();
  todos = todos.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return todos;
}

async function getOne({ id, fields }) {
  const todo = (await ref.doc(id.toString()).get()).data();
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
  await ref.add(data);
  return data;
}

async function change(id, data) {
  const todo = (await ref.doc(id.toString()).get()).data();
  await ref.doc(id.toString()).update(data);
  return data;
}

async function remove(id) {
  await ref.doc(id).delete();
  return;
}

async function removeAll() {
  (await ref.get()).docs.map(async (doc) => {
    await ref.doc(doc.id).delete();
  });
}
module.exports = {
  db,
  getOne,
  getAll,
  add,
  change,
  remove,
  removeAll,
};
