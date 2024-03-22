import { Modal, TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";

function CreateTodoModal({ addTodo, open, setOpen }) {
  const [todoName, setTodoName] = useState();

  const handleAdd = useCallback(() => {
    if (todoName) addTodo(todoName);
    setTodoName("");
    setOpen(false);
  }, [todoName, setTodoName, setOpen, addTodo]);

  const handleClose = useCallback(() => {
    setTodoName("");
    setOpen(false);
  }, [setTodoName, setOpen]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create todo"
      primaryAction={{
        content: "Add",
        onAction: handleAdd,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleClose,
        },
      ]}
    >
      <Modal.Section>
        <TextField
          label="title"
          value={todoName}
          onChange={(newName) => {
            setTodoName(newName);
          }}
        />
      </Modal.Section>
    </Modal>
  );
}

export default CreateTodoModal;
