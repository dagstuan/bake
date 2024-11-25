import { AddIcon } from "@sanity/icons";
import { Button, Flex, Text, Stack, TextInput } from "@sanity/ui";
import {
  isNonNullable,
  Reference,
  ReferenceInputProps,
  set,
  setIfMissing,
  useReferenceInputOptions,
} from "sanity";
import { Recipe } from "../../../sanity.types";
import { useFormValue } from "./utils";
import { recipeIngredientType } from "../schemaTypes/recipe/recipeIngredientType";
import { uuid } from "@sanity/uuid";
import { useCallback, useState } from "react";
import { baseDryIngredientsName } from "../schemaTypes/recipe/constants";

const parseInitialPercent = (value: string): number => {
  const number = Number(value);
  return isNaN(number) ? 1 : number;
};

export const IngredientsInputComponent = (props: ReferenceInputProps) => {
  const { onChange, onPathFocus, path } = props;

  const { onEditReference } = useReferenceInputOptions();

  const sumBaseIngredients =
    useFormValue<Recipe["baseDryIngredients"]>([baseDryIngredientsName]) ?? 1;

  const [initialPercent, setInitialPercent] = useState("");

  const handleClick = useCallback(() => {
    const newDocumentId = uuid();

    const percent =
      (parseInitialPercent(initialPercent) / sumBaseIngredients) * 100;

    const reference = {
      _type: "reference",
      _ref: newDocumentId,
      _weak: true,
      _strengthenOnPublish: {
        type: recipeIngredientType.name,
        template: {
          id: "recipeIngredientWithPercentage",
          params: { percent },
        },
      },
    } satisfies Reference;

    // https://github.com/sanity-io/sanity/blob/next/packages/sanity/src/core/form/inputs/ReferenceInput/ReferenceInput.tsx#L73-L81
    const patches = [
      setIfMissing({}),
      set(reference._type, ["_type"]),
      set(reference._ref, ["_ref"]),
      set(reference._weak, ["_weak"]),
      set(reference._strengthenOnPublish, ["_strengthenOnPublish"]),
    ].filter(isNonNullable);

    onChange(patches);

    onEditReference?.({
      id: newDocumentId,
      type: recipeIngredientType.name,
      template: reference._strengthenOnPublish.template,
      parentRefPath: path,
    });
    onPathFocus([]);
  }, [
    onChange,
    onPathFocus,
    onEditReference,
    path,
    initialPercent,
    sumBaseIngredients,
  ]);

  return (
    <Stack space={4}>
      {props.renderDefault(props)}

      <Stack space={3}>
        <Text size={1} weight="medium">
          New with initial amount
        </Text>
        <Flex gap={3} direction={["column", "column", "row"]}>
          <TextInput
            onChange={(event) => {
              setInitialPercent(event.currentTarget.value);
            }}
            value={initialPercent}
            type="number"
            placeholder="Initial amount"
          />

          <Button
            icon={AddIcon}
            mode="ghost"
            text="Create with initial amount"
            onClick={handleClick}
          />
        </Flex>
      </Stack>
    </Stack>
  );
};
