const faker = require("faker");
const { add, removeAll } = require("./todoRepository");

async function generateRandomTodos() {
  try {
    for (let i = 0; i < 10; i++) {
      const todo = {
        text: faker.lorem.sentence(),
        isCompleted: false,
      };
      await add(todo);
    }
  } catch (e) {
    console.log(e);
  }
}

(async () => {
  await removeAll();
  await generateRandomTodos();
  console.log("data added!");
})();
