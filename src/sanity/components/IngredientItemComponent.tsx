import { ScissorsIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex } from "@sanity/ui";
import { ObjectItem, ObjectItemProps, ReferenceValue } from "sanity";

export const IngredientItemComponent = (
  props: ObjectItemProps<ReferenceValue & ObjectItem>,
) => {
  const handleCut = () => {
    props.onCopy({ items: [props.value] });
    props.onRemove();
  };

  return (
    <Flex gap={3} paddingRight={2} align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>
      <Button
        fontSize={[1, 1, 2]}
        padding={[1, 1, 2]}
        icon={ScissorsIcon}
        mode="ghost"
        onClick={handleCut}
        text="Cut"
      />
    </Flex>
  );
};
