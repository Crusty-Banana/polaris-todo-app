import { Page } from "@shopify/polaris";
import CreateTodoModal from "../CreateTodoModal/CreateTodoModal";
import { useCallback, useState } from "react";
import useFetchApi from "../../hooks/useFetchApi";
import TodoList from "../TodoList/TodoList";

function TodoPage() {
  const [open, setOpen] = useState(false);
  // todo: useFetchAPi
  const {
    getItems: getTodos,
    completeItem: completeTodo,
    removeItem: removeTodo,
    addItem: addTodo,
    incompleteItem: incompleteTodo,
    items: todos,
  } = useFetchApi("/todos");
  const handleCreate = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <Page
      title="Todoes"
      primaryAction={{ content: "Create", onAction: handleCreate }}
    >
      <CreateTodoModal addTodo={addTodo} open={open} setOpen={setOpen} />
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
