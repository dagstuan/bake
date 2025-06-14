import { isDefined } from "@/utils/tsUtils";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import * as v from "valibot";
import { IngredientUnit } from "../types";
import { isEditableUnit } from "../utils";
import {
  Conversions,
  IngredientsCompletionState,
  RecipeState,
  recipeStateSchema,
} from "./types";
import { calculateTotalYield, getWeightInGramsForUnit } from "./utils";

export const minServings = 0.01;
export const maxServings = 999;

interface RecipeStore extends RecipeState {
  resetIngredientsCompletionState: (completed: boolean) => void;
  onIngredientReferenceCompletionChange: (
    ingredientId: string,
    ingredientReferenceKey: string,
  ) => void;
  onIngredientCompletionChange: (
    ingredientId: string,
    completed: boolean,
  ) => void;
  onAllIngredientsCompletionChange: (
    group: string | null,
    completed: boolean,
  ) => void;
  onServingsChange: (newServings: number) => void;
  onTotalYieldChange: (newTotalYield: number) => void;
  onIngredientAmountChange: (ingredientId: string, newAmount: number) => void;
  onIngredientUnitChange: (
    ingredientId: string,
    newUnit: IngredientUnit,
  ) => void;
  onAllIngredientsUnitChange: (newUnit: IngredientUnit) => void;
  onConvertIngredient: (ingredientId: string, newIngredientId: string) => void;
  reset: (newState: RecipeState) => void;
}

const resetIngredientsCompletionState = (
  ingredientsCompletionState: IngredientsCompletionState,
  completed: boolean,
): IngredientsCompletionState => {
  Object.keys(ingredientsCompletionState).forEach((ingredientId) => {
    const recipeIngredients = ingredientsCompletionState[ingredientId];
    if (recipeIngredients) {
      Object.keys(recipeIngredients).forEach((recipeIngredientKey) => {
        recipeIngredients[recipeIngredientKey].completed = completed;
      });
    }
  });
  return ingredientsCompletionState;
};

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const isStateExpired = (persistedAt?: number): boolean => {
  if (!persistedAt) return true; // If no timestamp, consider it expired
  const now = Date.now();
  return now - persistedAt > ONE_WEEK_MS;
};

const storageSchema = v.object({
  state: v.object({
    ...recipeStateSchema.entries,
    persistedAt: v.number(),
  }),
  version: v.optional(v.number()),
});

const setStorageSchema = v.object({
  state: recipeStateSchema,
  version: v.optional(v.number()),
});

// Custom storage that automatically adds timestamp when persisting
const createTimestampedStorage = (): StateStorage => {
  const originalStorage = localStorage;

  return {
    getItem: (name) => {
      const item = originalStorage.getItem(name);
      if (!item) return null;

      const parsedData = v.safeParse(storageSchema, JSON.parse(item));

      if (!parsedData.success) {
        originalStorage.removeItem(name);
        return null;
      }

      // If state is expired, only reset ingredientsCompletion while keeping the rest
      if (isStateExpired(parsedData.output.state.persistedAt)) {
        const expiredState = parsedData.output.state;

        const updatedData = {
          ...parsedData.output,
          state: {
            ...expiredState,
            ingredientsCompletion: resetIngredientsCompletionState(
              expiredState.ingredientsCompletion,
              false,
            ),
            persistedAt: Date.now(), // Update timestamp
          },
        };

        // Save the updated data back to storage
        originalStorage.setItem(name, JSON.stringify(updatedData));

        return JSON.stringify(updatedData);
      }

      return item;
    },

    setItem: (name, value) => {
      const validateResult = v.safeParse(setStorageSchema, JSON.parse(value));

      if (!validateResult.success) {
        console.warn(
          "Invalid data structure when setting localStorage:",
          validateResult.issues,
        );
        originalStorage.setItem(name, value);
        return;
      }

      const dataWithTimestamp: v.InferOutput<typeof storageSchema> = {
        ...validateResult.output,
        state: {
          ...validateResult.output.state,
          persistedAt: Date.now(),
        },
      };

      originalStorage.setItem(name, JSON.stringify(dataWithTimestamp));
    },

    removeItem: (name) => {
      originalStorage.removeItem(name);
    },
  };
};

export const createRecipeStore = (
  initProps: RecipeState,
  storageKey: string,
  version: string,
) => {
  return create<RecipeStore>()(
    persist(
      immer((set) => ({
        ...initProps,

        resetIngredientsCompletionState: (completed) => {
          set((state) => {
            state.ingredientsCompletion = resetIngredientsCompletionState(
              state.ingredientsCompletion,
              completed,
            );
          });
        },

        onIngredientReferenceCompletionChange: (
          ingredientId,
          ingredientReferenceKey,
        ) => {
          set((state) => {
            const currentIngredient = state.ingredientsCompletion[ingredientId];
            if (currentIngredient) {
              const currentKeyStatus =
                currentIngredient[ingredientReferenceKey].completed;

              currentIngredient[ingredientReferenceKey] = {
                completed: !currentKeyStatus,
              };
            }
          });
        },

        onIngredientCompletionChange: (ingredientId, completed) => {
          set((state) => {
            const ingredientCompletion =
              state.ingredientsCompletion[ingredientId];

            if (ingredientCompletion) {
              Object.values(ingredientCompletion).forEach((reference) => {
                reference.completed = completed;
              });
            }
          });
        },

        onAllIngredientsCompletionChange: (group, completed) => {
          set((state) => {
            const ingredientsToUpdate = state.ingredients.filter(
              (i) => i.group === group,
            );

            for (const ingredient of ingredientsToUpdate) {
              const ingredientCompletion =
                state.ingredientsCompletion[ingredient.id];

              if (ingredientCompletion) {
                for (const recipeIngredientKey of Object.keys(
                  ingredientCompletion,
                )) {
                  ingredientCompletion[recipeIngredientKey].completed =
                    completed;
                }
              }
            }
          });
        },

        onServingsChange: (newServings) => {
          set((state) => {
            if (
              newServings <= 0 ||
              isNaN(newServings) ||
              newServings < minServings ||
              newServings >= maxServings
            ) {
              return;
            }

            const changePercent = newServings / state.servings;
            state.totalYield = newServings * state.yieldPerServing;
            state.servings = newServings;

            state.ingredients.forEach((ingredient) => {
              if (isDefined(ingredient.amount)) {
                ingredient.amount *= changePercent;
              }
            });

            state.ingredientsCompletion = resetIngredientsCompletionState(
              state.ingredientsCompletion,
              false,
            );
          });
        },

        onTotalYieldChange: (newTotalYield) => {
          set((state) => {
            if (newTotalYield <= 0 || isNaN(newTotalYield)) {
              return;
            }

            const changePercent = newTotalYield / state.totalYield;
            state.totalYield = newTotalYield;
            state.servings = newTotalYield / state.yieldPerServing;

            state.ingredients.forEach((ingredient) => {
              if (isDefined(ingredient.amount)) {
                ingredient.amount *= changePercent;
              }
            });

            state.ingredientsCompletion = resetIngredientsCompletionState(
              state.ingredientsCompletion,
              false,
            );
          });
        },

        onIngredientAmountChange: (ingredientId, newAmount) => {
          set((state) => {
            if (newAmount === 0 || isNaN(newAmount)) {
              return;
            }

            const ingredientToUpdate = state.ingredients.find(
              (ingredient) => ingredient.id === ingredientId,
            );

            if (!ingredientToUpdate?.amount || !ingredientToUpdate.unit) {
              return;
            }

            const weightInGrams = getWeightInGramsForUnit(
              ingredientToUpdate.weights,
              ingredientToUpdate.unit,
            );
            const oldAmountGrams = ingredientToUpdate.amount * weightInGrams;
            const newAmountGrams = newAmount * weightInGrams;
            const scaleFactor = newAmountGrams / oldAmountGrams;

            state.ingredients.forEach((ingredient) => {
              if (!ingredient.amount || !ingredient.unit) {
                return;
              }

              if (ingredient.id === ingredientId) {
                ingredient.amount = newAmount;
              } else if (isDefined(ingredient.amount)) {
                ingredient.amount *= scaleFactor;
              }
            });

            const updatedTotalYield = calculateTotalYield(state.ingredients);
            state.totalYield = updatedTotalYield;
            state.servings = updatedTotalYield / state.yieldPerServing;
            state.ingredientsCompletion = resetIngredientsCompletionState(
              state.ingredientsCompletion,
              false,
            );
          });
        },

        onIngredientUnitChange: (ingredientId, newUnit) => {
          set((state) => {
            const ingredientToUpdate = state.ingredients.find(
              (ingredient) => ingredient.id === ingredientId,
            );

            if (
              ingredientToUpdate?.type !== "ingredient" ||
              !ingredientToUpdate.amount ||
              !ingredientToUpdate.unit ||
              ingredientToUpdate.unit === newUnit ||
              !isEditableUnit(ingredientToUpdate.unit)
            ) {
              return;
            }

            const oldWeightInGrams = getWeightInGramsForUnit(
              ingredientToUpdate.weights,
              ingredientToUpdate.unit,
            );
            const newWeightInGrams = getWeightInGramsForUnit(
              ingredientToUpdate.weights,
              newUnit,
            );
            const amountInGrams = ingredientToUpdate.amount * oldWeightInGrams;

            ingredientToUpdate.amount = amountInGrams / newWeightInGrams;
            ingredientToUpdate.unit = newUnit;
          });
        },

        onAllIngredientsUnitChange: (newUnit) => {
          set((state) => {
            state.ingredients.forEach((ingredient) => {
              if (
                ingredient.type !== "ingredient" ||
                !ingredient.amount ||
                !ingredient.unit ||
                ingredient.unit === newUnit ||
                !isEditableUnit(ingredient.unit)
              ) {
                return;
              }

              const oldWeightInGrams = getWeightInGramsForUnit(
                ingredient.weights,
                ingredient.unit,
              );
              const newWeightInGrams = getWeightInGramsForUnit(
                ingredient.weights,
                newUnit,
              );
              const amountInGrams = ingredient.amount * oldWeightInGrams;

              ingredient.amount = amountInGrams / newWeightInGrams;
              ingredient.unit = newUnit;
            });
          });
        },

        onConvertIngredient: (ingredientId, newIngredientId) => {
          set((state) => {
            const ingredientToConvert = state.ingredients.find(
              (ingredient) => ingredient.id === ingredientId,
            );

            if (ingredientToConvert?.type !== "ingredient") {
              return;
            }

            const newIngredient = ingredientToConvert.conversions.find(
              (c) => c.to === newIngredientId,
            );

            if (!newIngredient) {
              return;
            }

            const newConversions: Conversions = ingredientToConvert.conversions
              .filter((c) => c.to !== newIngredient.to)
              .map((c) => ({
                to: c.to,
                rate: c.rate / newIngredient.rate,
                weights: {
                  l: c.weights.l,
                  ss: c.weights.ss,
                  ts: c.weights.ts,
                  stk: c.weights.stk,
                },
              }))
              .concat([
                {
                  to: ingredientToConvert.name,
                  rate: 1 / newIngredient.rate,
                  weights: {
                    l: ingredientToConvert.weights.l,
                    ss: ingredientToConvert.weights.ss,
                    ts: ingredientToConvert.weights.ts,
                    stk: ingredientToConvert.weights.stk,
                  },
                },
              ]);

            ingredientToConvert.name = newIngredient.to;

            if (ingredientToConvert.amount && ingredientToConvert.unit) {
              const oldWeightInGrams = getWeightInGramsForUnit(
                ingredientToConvert.weights,
                ingredientToConvert.unit,
              );
              const amountInGrams =
                ingredientToConvert.amount * oldWeightInGrams;

              ingredientToConvert.amount = amountInGrams * newIngredient.rate;
              ingredientToConvert.unit = "g";
            }

            ingredientToConvert.weights = newIngredient.weights;
            ingredientToConvert.conversions = newConversions;

            const updatedTotalYield = calculateTotalYield(state.ingredients);
            state.totalYield = updatedTotalYield;
            state.yieldPerServing = updatedTotalYield / state.servings;
          });
        },

        reset: (newState) => {
          set(() => ({
            ...newState,
          }));
        },
      })),
      {
        name: storageKey,
        storage: createJSONStorage(() => createTimestampedStorage()),
        version:
          hashString(version) + hashString(JSON.stringify(recipeStateSchema)),
      },
    ),
  );
};
