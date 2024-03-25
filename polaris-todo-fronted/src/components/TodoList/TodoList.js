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
  const handleBulk = useCallback(
    async (actionTodo) => {
      selectedItems.forEach((item) =>
        setLoading((prev) => ({ ...prev, [item]: true }))
      );

      setSelectedItems([]);
      const promises = selectedItems.map(actionTodo);
      await Promise.all(promises);

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
      console.log(loading[id]);
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
                  setLoading((prev) => ({ ...prev, [id]: false }));
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
            <Button onClick={async () => await handleBulk(completeTodo)}>
              Complete
            </Button>
            <Button onClick={async () => await handleBulk(incompleteTodo)}>
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
