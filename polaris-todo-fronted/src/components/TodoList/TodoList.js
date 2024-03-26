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
    async (actionTodo) => {
      selectedItems.forEach((item) =>
        setLoading((prev) => ({ ...prev, [item]: true }))
      );

      setSelectedItems([]);
      const promises = selectedItems.map(actionTodo);
      await Promise.all(promises);
      await getTodos();

      selectedItems.forEach((item) =>
        setLoading((prev) => ({ ...prev, [item]: false }))
      );
    },
    [selectedItems]
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
                  setLoading((prev) => ({ ...prev, [id]: true }));
                  isCompleted
                    ? await incompleteTodo(id)
                    : await completeTodo(id);
                  await getTodos();
                  setLoading((prev) => ({ ...prev, [id]: false }));
                }}
              >
                {isCompleted ? "Incomplete" : "Complete"}
              </Button>
              <Button
                disabled={loading[id]}
                onClick={async () => {
                  setLoading((prev) => ({ ...prev, [id]: true }));
                  await removeTodo(id);
                  await getTodos();
                  delete loading[id];
                }}
                tone="critical"
              >
                Delete
              </Button>
              {loading[id] && <Spinner size="small" />}
            </InlineStack>
          </InlineStack>
        </ResourceItem>
      );
    },
    [sortValue, loading]
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
              onClick={async () => await handleBulk(completeTodo)}
              disabled={bulkButtonDisability[0]}
            >
              Complete
            </Button>
            <Button
              onClick={async () => await handleBulk(incompleteTodo)}
              disabled={bulkButtonDisability[1]}
            >
              Incomplete
            </Button>
            <Button onClick={async () => await handleBulk(removeTodo)}>
              Delete
            </Button>
          </ButtonGroup>
        </InlineStack>
      )}
    </BlockStack>
  );
}

export default TodoList;
