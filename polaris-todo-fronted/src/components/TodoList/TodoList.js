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
}) {
  const [selectedItems, setSelectedItems] = useState([]);
  const handleBulk = useCallback(
    async (actionTodo) => {
      selectedItems.forEach(async (item) => await actionTodo(item));
      setSelectedItems([]);
    },
    [selectedItems]
  );

  useEffect(() => {
    getTodos();
  }, []);

  const TodoItem = ({ id, text, isCompleted }) => {
    const [loading, setLoading] = useState(false);
    return (
      <ResourceItem id={id} text={text}>
        <InlineStack align="space-between">
          <Text variant="bodyMd" fontWeight="bold" as="h3">
            {text}
          </Text>
          <InlineStack align="space-between" gap={200}>
            <BorderedText isCompleted={isCompleted} />
            <Button
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                (await isCompleted)
                  ? await incompleteTodo(id)
                  : await completeTodo(id);
                setLoading(false);
              }}
            >
              {isCompleted ? "Incomplete" : "Complete"}
            </Button>
            <Button
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                await removeTodo(id);
                setLoading(false);
              }}
              tone="critical"
            >
              Delete
            </Button>
            {loading && <Spinner size="small" />}
          </InlineStack>
        </InlineStack>
      </ResourceItem>
    );
  };
  const renderTodo = useCallback(({ id, text, isCompleted }) => {
    return <TodoItem id={id} text={text} isCompleted={isCompleted} />;
  }, []);

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
