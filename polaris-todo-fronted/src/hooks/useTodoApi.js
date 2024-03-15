import { useState, useEffect } from "react";

function useTodoApi() {
  const [todos, setTodos] = useState([]);
  const apiUrl = "http://localhost:5555/api";

  const getTodos = async () => {
    try {
      const response = await fetch(apiUrl + "/todos");
      if (!response.ok) {
        throw new Error("Todos not founded!");
      }
      const data = await response.json();
      setTodos([...data.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const addTodo = async (text) => {
    try {
      const response = await fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      getTodos();
    } catch (e) {
      console.log(e);
    }
  };

  const changeTodo = async (id, status) => {
    const response = await fetch(apiUrl + "/todo/" + id.toString(), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isCompleted: status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to changes todo's status");
    }
    getTodos();
  };

  const completeTodo = (id) => {
    changeTodo(id, true);
  };

  const incompleteTodo = (id) => {
    changeTodo(id, false);
  };

  const removeTodo = async (id) => {
    try {
      const response = await fetch(apiUrl + "/todo/" + id.toString(), {
        method: "DEL",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      getTodos();
    } catch (e) {
      console.log(e);
    }
  };
  return {
    todos,
    addTodo,
    completeTodo,
    removeTodo,
    incompleteTodo,
    getTodos,
  };
}

export default useTodoApi;
