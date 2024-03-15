const faker = require("faker");
const { add, deleteAllData } = require("./todoRepository");

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
  await deleteAllData();
  await generateRandomTodos();
  console.log("data added!");
})();
