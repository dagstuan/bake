import { useCallback } from "react";
import { Stack, Text, TextInput, useToast } from "@sanity/ui";
import {
  PatchEvent,
  StringInputProps,
  set,
  unset,
  useFormCallbacks,
} from "sanity";
import { useDebouncedCallback } from "use-debounce";

export function MatpratNameInput(props: StringInputProps) {
  const { onChange, value = "", elementProps, path } = props;
  const toast = useToast();

  const { onChange: unprefixedOnChange } = useFormCallbacks();

  const fetchMatpratData = useDebouncedCallback(async (inputValue: string) => {
    if (!inputValue) return;

    try {
      const response = await fetch(
        `/api/matprat/ingredient?name=${inputValue}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ingredient weights");
      }

      const matpratIngredient = await response.json();
      unprefixedOnChange(
        PatchEvent.from(
          set(
            {
              _type: "ingredientWeights",
              liter: matpratIngredient.units?.liter?.weight,
              tablespoon: matpratIngredient.units?.tablespoon?.weight,
              teaspoon: matpratIngredient.units?.teaspoon?.weight,
            },
            ["weights"],
          ),
        ),
      );
      toast.push({
        closable: true,
        status: "success",
        title: "Updated ingredient weights from Matprat.",
      });
    } catch (error) {
      toast.push({
        closable: true,
        status: "error",
        title: "Failed to fetch ingredient weights",
      });

      unprefixedOnChange(PatchEvent.from(unset(["weights"])));
    }
  }, 500);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.currentTarget.value;
      onChange(inputValue ? set(inputValue) : unset());
      fetchMatpratData(inputValue);
    },
    [onChange, fetchMatpratData],
  );

  return (
    <Stack space={3}>
      <TextInput
        {...elementProps}
        onChange={handleChange}
        value={value}
        placeholder="Enter Matprat ingredient name"
      />
      <Text size={1} muted>
        Enter a Matprat ingredient name to automatically fetch weight data
      </Text>
    </Stack>
  );
}
