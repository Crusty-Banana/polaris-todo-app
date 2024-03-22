import {
  ResourceList,
  InlineStack,
  ResourceItem,
  Text,
  ButtonGroup,
  Button,
  Box,
  BlockStack,
  Layout,
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

  const renderTodo = useCallback(({ id, text, isCompleted }) => {
    return (
      <ResourceItem id={id} text={text}>
        <InlineStack align="space-between">
          <Text variant="bodyMd" fontWeight="bold" as="h3">
            {text}
          </Text>
          <InlineStack align="space-between" gap={200}>
            <BorderedText isCompleted={isCompleted} />
            <Button onClick={async () => await completeTodo(id)}>
              Complete
            </Button>
            <Button onClick={async () => await removeTodo(id)} tone="critical">
              Delete
            </Button>
          </InlineStack>
        </InlineStack>
      </ResourceItem>
    );
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
        <Layout>
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
        </Layout>
      )}
    </BlockStack>
  );
}

export default TodoList;
