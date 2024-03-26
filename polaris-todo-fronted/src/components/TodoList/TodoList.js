import {
  ResourceList,
  InlineStack,
  ResourceItem,
  Text,
  ButtonGroup,
  Button,
  Box,
  BlockStack,
  Spinner,
  Toast,
} from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";

function TodoList({
  todos,
  getTodos,
  completeTodo,
  removeTodo,
  incompleteTodo,
  sortValue,
  setSortValue,
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState({});
  const [bulkButtonDisability, setBulkButtonDisability] = useState([
    false,
    false,
  ]);
  const [toastActive, setToastActive] = useState({});
  useEffect(() => {
    let count = 0;
    for (let i = 0; i < todos.length; i++) {
      if (selectedItems.includes(todos[i].id)) {
        if (todos[i].isCompleted === true) {
          count++;
        }
      }
    }
    if (count === selectedItems.length) {
      setBulkButtonDisability([true, false]);
    }
    if (count === 0) {
      setBulkButtonDisability([false, true]);
    }
    if (count > 0 && count < selectedItems.length) {
      setBulkButtonDisability([false, false]);
    }
  }, [selectedItems, todos]);

  const handleBulk = useCallback(
    async (actionTodo, action) => {
      selectedItems.forEach((item) =>
        setLoading((prev) => ({ ...prev, [item]: action }))
      );

      setSelectedItems([]);
      const promises = selectedItems.map(actionTodo);
      await Promise.all(promises);
      await getTodos();

      selectedItems.forEach((item) => {
        if (action === "deleting") {
          delete loading[item];
          setToastActive((prev) => ({ ...prev, [item]: "deleted" }));
        } else {
          setLoading((prev) => ({ ...prev, [item]: false }));
          setToastActive((prev) => ({ ...prev, [item]: "changed" }));
        }
      });
    },
    [selectedItems, todos]
  );

  useEffect(() => {
    getTodos();
  }, [sortValue]);

  const renderTodo = useCallback(
    ({ id, text, isCompleted }) => {
      return (
        <ResourceItem id={id} text={text}>
          <InlineStack align="space-between">
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {text}
            </Text>
            <InlineStack align="space-between" gap={200}>
              <BorderedText isCompleted={isCompleted} />
              <Button
                disabled={loading[id]}
                onClick={async () => {
                  setLoading((prev) => ({ ...prev, [id]: "changing" }));
                  isCompleted
                    ? await incompleteTodo(id)
                    : await completeTodo(id);
                  await getTodos();
                  setLoading((prev) => ({ ...prev, [id]: false }));
                  setToastActive((prev) => ({ ...prev, [id]: "changed" }));
                }}
              >
                {loading[id] === "changing" ? (
                  <Spinner size="small" />
                ) : isCompleted ? (
                  "Incomplete"
                ) : (
                  "Complete"
                )}
              </Button>
              <Button
                disabled={loading[id]}
                onClick={async () => {
                  setLoading((prev) => ({ ...prev, [id]: "deleting" }));
                  await removeTodo(id);
                  await getTodos();
                  delete loading[id];
                  setToastActive((prev) => ({ ...prev, [id]: "deleted" }));
                }}
                tone="critical"
              >
                {loading[id] === "deleting" ? (
                  <Spinner size="small" />
                ) : (
                  "Delete"
                )}
              </Button>
              {/* {loading[id] && <Spinner size="small" />} */}
            </InlineStack>
          </InlineStack>
          {toastActive[id] === "changed" ? (
            <Toast
              content={
                "Todo " +
                id +
                (isCompleted ? " is completed" : " is incompleted")
              }
              onDismiss={() =>
                setToastActive((prev) => ({ ...prev, [id]: false }))
              }
            />
          ) : null}
          {toastActive[id] === "deleted" ? (
            <Toast
              content={"Todo " + id + " deleted"}
              onDismiss={() =>
                setToastActive((prev) => ({ ...prev, [id]: false }))
              }
            />
          ) : null}
        </ResourceItem>
      );
    },
    [sortValue, loading, toastActive]
  );

  function BorderedText({ isCompleted }) {
    const text = isCompleted ? "Complete" : "Incomplete";
    const color = isCompleted ? "bg-fill-secondary" : "bg-fill-warning";
    return (
      <Box padding={100}>
        <Box paddingInline={200} borderRadius={200} background={color}>
          <Text as="h1">{text}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <BlockStack gap="500">
      <ResourceList
        items={todos}
        renderItem={renderTodo}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable={true}
        sortValue={sortValue}
        sortOptions={[
          { label: "Newest update", value: "desc" },
          { label: "Oldest update", value: "asc" },
        ]}
        onSortChange={(selected) => {
          setSortValue(selected);
          console.log(`Sort option changed to ${selected}.`);
        }}
      />
      {selectedItems.length > 0 && (
        <InlineStack align="center">
          <ButtonGroup>
            <Button
              onClick={async () => await handleBulk(completeTodo, "changing")}
              disabled={bulkButtonDisability[0]}
            >
              Complete
            </Button>
            <Button
              onClick={async () => await handleBulk(incompleteTodo, "changing")}
              disabled={bulkButtonDisability[1]}
            >
              Incomplete
            </Button>
            <Button
              onClick={async () => await handleBulk(removeTodo, "deleting")}
            >
              Delete
            </Button>
          </ButtonGroup>
        </InlineStack>
      )}
    </BlockStack>
  );
}

export default TodoList;
