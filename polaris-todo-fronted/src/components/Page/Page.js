import { Page } from "@shopify/polaris";
import CreateModal from "../Modal/Modal";
import { useCallback, useState } from "react";
import useTodoApi from "../../hooks/useTodoApi";
import TodoList from "../TodoList/TodoList";

function TodoPage() {
  const [open, setOpen] = useState(false);
  const { getTodos, completeTodo, removeTodo, addTodo, incompleteTodo, todos } =
    useTodoApi();
  const handleCreate = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Page
      title="Todoes"
      primaryAction={{ content: "Create", onAction: handleCreate }}
    >
      <CreateModal addTodo={addTodo} open={open} setOpen={setOpen} />
      <TodoList
        todos={todos}
        getTodos={getTodos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        incompleteTodo={incompleteTodo}
      />
    </Page>
  );
}

export default TodoPage;
