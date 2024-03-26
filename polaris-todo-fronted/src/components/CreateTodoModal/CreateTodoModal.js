import { Modal, TextField, Spinner, InlineError, Text } from "@shopify/polaris";
import React, { useState, useCallback } from "react";

function CreateTodoModal({ addTodo, getTodos, open, setOpen }) {
  const [todoName, setTodoName] = useState();
  const [loading, setLoading] = useState(false);
  const [missingTitle, setMissingTitle] = useState(false);

  const handleAdd = useCallback(async () => {
    setLoading(true);
    if (todoName) {
      await addTodo(todoName);
      await getTodos();
      setTodoName("");
      setOpen(false);
      setMissingTitle(false);
    } else setMissingTitle(true);
    setLoading(false);
  }, [todoName, setTodoName, setOpen, addTodo]);

  const handleClose = useCallback(() => {
    setMissingTitle(false);
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
        {loading ? (
          <Spinner />
        ) : (
          <TextField
            label={
              <Text>
                Title
                {missingTitle && <InlineError message="Title is required" />}
              </Text>
            }
            value={todoName}
            onChange={(newName) => {
              setTodoName(newName);
            }}
          />
        )}
      </Modal.Section>
    </Modal>
  );
}

export default CreateTodoModal;
