import { useState } from "react";

function useFetchApi({ url = "/todos" }) {
  const [items, setItems] = useState([]);
  const apiUrl = "http://localhost:5555/api" + url;

  const getItems = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Todos not founded!");
      }
      const data = await response.json();
      setItems([...data.data]);
    } catch (e) {
      console.log(e);
    }
  };

  const addItem = async (text) => {
    try {
      const response = await fetch(apiUrl, {
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
      await getItems();
    } catch (e) {
      console.log(e);
    }
  };

  const changeItem = async (id, status) => {
    const response = await fetch(apiUrl + "/" + id, {
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
    await getItems();
  };

  const completeItem = async (id) => {
    await changeItem(id, true);
  };

  const incompleteItem = async (id) => {
    await changeItem(id, false);
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(apiUrl + "/" + id.toString(), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }
      await getItems();
    } catch (e) {
      console.log(e);
    }
  };
  return {
    items,
    addItem,
    completeItem,
    removeItem,
    incompleteItem,
    getItems,
  };
}

export default useFetchApi;
