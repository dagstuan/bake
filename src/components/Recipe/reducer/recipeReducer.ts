import { IngredientUnit } from "../types";
import { produce, WritableDraft } from "immer";
import { isDefined } from "@/utils/tsUtils";
import { isEditableUnit } from "../utils";
import {
  IngredientsCompletionState,
  RecipeIngredientState,
  RecipeState,
} from "./types";
import { calculateTotalYield, getWeightInGramsForUnit } from "./utils";

export const minServings = 1;
export const maxServings = 999;

const resetIngredientsCompletionState = (
  ingredientsCompletionState: IngredientsCompletionState,
  completed: boolean,
): IngredientsCompletionState => {
  return produce(ingredientsCompletionState, (draft) => {
    Object.keys(draft).forEach((ingredientId) => {
      const recipeIngredients = draft[ingredientId];
      Object.keys(recipeIngredients).forEach((recipeIngredientKey) => {
        recipeIngredients[recipeIngredientKey].completed = completed;
      });
    });
  });
};

export type RecipeAction =
  | {
      type: "onIngredientReferenceCompletionChange";
      payload: {
        ingredientId: string;
        ingredientReferenceKey: string;
      };
    }
  | {
      type: "onIngredientCompletionChange";
      payload: {
        ingredientId: string;
        completed: boolean;
      };
    }
  | {
      type: "onAllIngredientsCompletionChange";
      payload: {
        group: string | null;
        completed: boolean;
      };
    }
  | {
      type: "onServingsChange";
      payload: number;
    }
  | {
      type: "onIngredientAmountChange";
      payload: {
        ingredientId: string;
        newAmount: number;
      };
    }
  | {
      type: "onIngredientUnitChange";
      payload: {
        ingredientId: string;
        newUnit: IngredientUnit;
      };
    }
  | {
      type: "onAllIngredientsUnitChange";
      payload: IngredientUnit;
    }
  | { type: "reset"; payload: RecipeState };

export const recipeReducer = (
  state: RecipeState,
  action: RecipeAction,
): RecipeState => {
  switch (action.type) {
    case "onIngredientReferenceCompletionChange": {
      const { ingredientId, ingredientReferenceKey } = action.payload;

      return produce(state, (draft) => {
        const currentIngredient = draft.ingredientsCompletion[ingredientId];
        const currentKeyStatus =
          currentIngredient[ingredientReferenceKey]?.completed ?? false;

        currentIngredient[ingredientReferenceKey] = {
          completed: !currentKeyStatus,
        };
      });
    }
    case "onIngredientCompletionChange": {
      const { ingredientId, completed } = action.payload;

      return produce(state, (draft) => {
        const ingredientCompletion = draft.ingredientsCompletion[ingredientId];

        Object.values(ingredientCompletion).forEach((reference) => {
          reference.completed = completed;
        });
      });
    }
    case "onAllIngredientsCompletionChange": {
      return produce(state, (draft) => {
        const { group, completed } = action.payload;

        const ingredientsToUpdate = draft.ingredients.filter(
          (i) => i.group === group,
        );

        for (var ingredient of ingredientsToUpdate) {
          const ingredientCompletion =
            draft.ingredientsCompletion[ingredient.id];

          for (var recipeIngredientKey of Object.keys(ingredientCompletion)) {
            ingredientCompletion[recipeIngredientKey].completed = completed;
          }
        }
      });
    }
    case "onServingsChange": {
      const newServings = action.payload;

      if (
        newServings === 0 ||
        isNaN(newServings) ||
        newServings < minServings ||
        newServings >= maxServings
      ) {
        return state;
      }

      const changePercent = newServings / state.servings;

      return produce(state, (draft) => {
        draft.servings = newServings;

        draft.ingredients.forEach((ingredient) => {
          if (isDefined(ingredient.amount)) {
            ingredient.amount *= changePercent;
          }
        });

        draft.ingredientsCompletion = resetIngredientsCompletionState(
          draft.ingredientsCompletion,
          false,
        );
      });
    }
    case "onIngredientAmountChange": {
      const { newAmount, ingredientId } = action.payload;

      if (newAmount === 0 || isNaN(newAmount)) {
        return state;
      }

      return produce(state, (draft) => {
        const ingredientToUpdate = draft.ingredients.find(
          (ingredient) => ingredient.id === ingredientId,
        );

        if (
          !ingredientToUpdate?.amount ||
          !ingredientToUpdate.unit ||
          !ingredientToUpdate.weights
        ) {
          return;
        }

        const weightInGrams = getWeightInGramsForUnit(
          ingredientToUpdate.weights,
          ingredientToUpdate.unit,
        );
        const oldAmountGrams = ingredientToUpdate.amount * weightInGrams;
        const newAmountGrams = newAmount * weightInGrams;
        const scaleFactor = newAmountGrams / oldAmountGrams;

        draft.ingredients.forEach((ingredient) => {
          if (!ingredient.amount || !ingredient.unit || !ingredient.weights) {
            return;
          }

          if (ingredient.id === ingredientId) {
            ingredient.amount = newAmount;
          } else if (isDefined(ingredient.amount)) {
            ingredient.amount *= scaleFactor;
          }
        });

        const updatedTotalYield = calculateTotalYield(draft.ingredients);
        draft.servings = updatedTotalYield / draft.yieldPerServing;
        draft.ingredientsCompletion = resetIngredientsCompletionState(
          draft.ingredientsCompletion,
          false,
        );
      });
    }
    case "onIngredientUnitChange": {
      const { ingredientId, newUnit } = action.payload;

      return produce(state, (draft) => {
        const ingredientToUpdate = draft.ingredients.find(
          (ingredient) => ingredient.id === ingredientId,
        );

        if (ingredientToUpdate) {
          updateIngredientUnit(ingredientToUpdate, newUnit);
        }
      });
    }
    case "onAllIngredientsUnitChange": {
      const newUnit = action.payload;

      return produce(state, (draft) => {
        draft.ingredients.forEach((ingredient) => {
          updateIngredientUnit(ingredient, newUnit);
        });
      });
    }
    case "reset":
      return action.payload;
    default:
      return state;
  }
};

const updateIngredientUnit = (
  ingredient: WritableDraft<RecipeIngredientState>,
  newUnit: IngredientUnit,
) => {
  if (
    !ingredient?.amount ||
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
  const newWeightInGrams = getWeightInGramsForUnit(ingredient.weights, newUnit);
  const amountInGrams = ingredient.amount * oldWeightInGrams;

  ingredient.amount = amountInGrams / newWeightInGrams;
  ingredient.unit = newUnit;
};
