import { OmitStrict } from "@/utils/types";
import { RecipeQueryResult } from "../../../sanity.types";
import {
  IngredientUnit,
  RecipeIngredient,
  RecipeIngredients,
  RecipeInstructions,
} from "./types";
import { produce, WritableDraft } from "immer";
import { isDefined } from "@/utils/tsUtils";
import * as v from "valibot";
import { isEditableUnit } from "./utils";

export const minServings = 1;
export const maxServings = 999;

const ingredientsCompletionSchema = v.record(
  v.string(),
  v.record(
    v.string(),
    v.object({
      completed: v.boolean(),
    }),
  ),
);
export type IngredientsCompletionState = v.InferInput<
  typeof ingredientsCompletionSchema
>;

const ingredientsGroupOrderSchema = v.array(v.string());
type IngredientsGroupOrder = v.InferInput<typeof ingredientsGroupOrderSchema>;

export const ingredientUnit = v.union([
  v.literal("dl"),
  v.literal("fedd"),
  v.literal("g"),
  v.literal("neve"),
  v.literal("ss"),
  v.literal("stk"),
  v.literal("ts"),
  v.literal("kg"),
  v.literal("l"),
]);

const recipeIngredientStateSchema = v.object({
  id: v.string(),
  name: v.string(),
  group: v.nullable(v.string()),
  percent: v.optional(v.number()),
  amount: v.optional(v.number()),
  unit: v.optional(v.union([ingredientUnit, v.undefined(), v.null()])),
  weights: v.object({
    l: v.nullable(v.number()),
    ss: v.nullable(v.number()),
    ts: v.nullable(v.number()),
  }),
  comment: v.optional(v.nullable(v.string())),
});
export type RecipeIngredientState = v.InferInput<
  typeof recipeIngredientStateSchema
>;

const recipeIngredientsStateSchema = v.array(recipeIngredientStateSchema);
type RecipeIngredientsState = v.InferInput<typeof recipeIngredientsStateSchema>;

export const recipeStateSchema = v.object({
  recipeRevision: v.string(),
  initialServings: v.number(),
  servings: v.number(),
  ingredientsCompletion: ingredientsCompletionSchema,
  ingredientsGroupOrder: ingredientsGroupOrderSchema,
  ingredients: recipeIngredientsStateSchema,
  yieldPerServing: v.number(),
});

export type RecipeState = v.InferInput<typeof recipeStateSchema>;

export const calcIngredientAmount = (
  percent: number | null | undefined,
  baseIngredientsAmount: number,
): number | undefined =>
  percent ? baseIngredientsAmount * (percent / 100) : undefined;

export const calcInitialIngredientsCompletionState = (
  instructions: RecipeInstructions | null | undefined,
): IngredientsCompletionState => {
  if (!instructions) {
    return {};
  }

  return instructions
    .filter((i) => i._type === "block")
    .reduce<IngredientsCompletionState>((state, instruction) => {
      const ingredientReferences = instruction.children
        ?.filter((x) => x._type === "recipeIngredientReference")
        .filter((x) => x.hideCheckbox !== true);

      ingredientReferences?.forEach((recipeInstruction) => {
        const ingredientId = recipeInstruction.ingredient?._id;
        if (!ingredientId) {
          return;
        }

        if (!state[ingredientId]) {
          state[ingredientId] = {};
        }

        const recipeInstructionKey = recipeInstruction._key;
        state[ingredientId][recipeInstructionKey] = {
          completed: false,
        };
      });

      return state;
    }, {});
};

export const isIngredientComplete = (
  ingredientsCompletion: IngredientsCompletionState,
  ingredientId: string,
) => {
  const ingredient = ingredientsCompletion[ingredientId];

  if (!ingredient) {
    return false;
  }

  return Object.values(ingredient).every((x) => x.completed);
};

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

const mapIngredientReferenceToIngredient = (
  baseDryIngredients: number,
  group: string | null,
  ingredientRef: OmitStrict<RecipeIngredient, "_type"> | null,
): RecipeIngredientState | null => {
  const { _id, ingredient, percent, unit, comment } = ingredientRef ?? {};

  if (!_id || !ingredient || !ingredient.name) {
    return null;
  }

  return {
    id: _id,
    name: ingredient.name,
    percent: percent ?? undefined,
    group: group,
    amount: calcIngredientAmount(percent, baseDryIngredients) ?? undefined,
    unit: unit,
    weights: {
      l: ingredient.weights?.liter ?? null,
      ss: ingredient.weights?.tablespoon ?? null,
      ts: ingredient.weights?.teaspoon ?? null,
    },
    comment: comment,
  };
};

const calcInitialRecipeIngredientsState = (
  baseDryIngredients: number,
  recipeIngredientsQueryResult: RecipeIngredients | null | undefined,
): [IngredientsGroupOrder, RecipeIngredientsState] => {
  const groupOrder: IngredientsGroupOrder = [];

  const ingredientsState =
    recipeIngredientsQueryResult
      ?.map((ingredientRef) => {
        if (ingredientRef?._type === "reference") {
          return [
            mapIngredientReferenceToIngredient(
              baseDryIngredients,
              null,
              ingredientRef,
            ),
          ];
        } else if (
          ingredientRef.title != null &&
          (ingredientRef.ingredients?.length ?? 0) > 0
        ) {
          groupOrder.push(ingredientRef.title);

          return ingredientRef.ingredients?.map((ingredient) =>
            mapIngredientReferenceToIngredient(
              baseDryIngredients,
              ingredientRef.title,
              ingredient,
            ),
          );
        }
      })
      .flat()
      .filter((r) => r != null) ?? [];

  return [groupOrder, ingredientsState];
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
      type: "onIngredientChange";
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

export const calcInitialState = (
  recipe: NonNullable<RecipeQueryResult>,
): RecipeState => {
  const { _rev, servings, instructions, ingredients, baseDryIngredients } =
    recipe;

  const initialServingsNum = servings ?? 1;
  const initialDryIngredients = baseDryIngredients ?? 1000;

  const [groupOrder, ingredientsState] = calcInitialRecipeIngredientsState(
    initialDryIngredients,
    ingredients,
  );

  const totalYield = calcTotalYield(ingredientsState);

  return {
    recipeRevision: _rev,
    initialServings: initialServingsNum,
    servings: initialServingsNum,
    ingredientsGroupOrder: groupOrder,
    ingredientsCompletion: calcInitialIngredientsCompletionState(instructions),
    ingredients: ingredientsState,
    yieldPerServing: totalYield / initialServingsNum,
  };
};

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
        const currentIngredient = draft.ingredientsCompletion[ingredientId];

        Object.keys(currentIngredient).forEach((recipeIngredientKey) => {
          currentIngredient[recipeIngredientKey].completed = completed;
        });
      });
    }
    case "onAllIngredientsCompletionChange": {
      return produce(state, (draft) => {
        const { group, completed } = action.payload;

        const ingredientsToUpdate = draft.ingredients.filter(
          (i) => i.group === group,
        );

        ingredientsToUpdate.forEach((ingredient) => {
          const ingredientCompletion =
            draft.ingredientsCompletion[ingredient.id];

          Object.keys(ingredientCompletion).forEach((recipeIngredientKey) => {
            ingredientCompletion[recipeIngredientKey].completed = completed;
          });
        });
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
    case "onIngredientChange": {
      const { newAmount, ingredientId } = action.payload;

      if (newAmount === 0 || isNaN(newAmount)) {
        return state;
      }

      return produce(state, (draft) => {
        const ingredientToUpdate = draft.ingredients.find(
          (ingredient) => ingredient.id === ingredientId,
        );

        if (!ingredientToUpdate) {
          return;
        }

        const updatedIngredientOriginalAmount = ingredientToUpdate.amount;
        const updatedIngredientUnit = ingredientToUpdate.unit;
        const updatedIngredientPercent = ingredientToUpdate.percent;
        const updatedIngredientWeights = ingredientToUpdate.weights;

        if (
          !updatedIngredientOriginalAmount ||
          !updatedIngredientUnit ||
          !updatedIngredientPercent ||
          !updatedIngredientWeights
        ) {
          return;
        }

        const updatedIngredientWeight = getWeightForUnit(
          updatedIngredientWeights,
          updatedIngredientUnit,
        );

        const updatedIngredientOriginalAmountGrams =
          updatedIngredientOriginalAmount * updatedIngredientWeight;
        const updatedIngredientAmountGrams =
          newAmount * updatedIngredientWeight;

        draft.ingredients.forEach((ingredient) => {
          const { id, percent, amount, unit, weights } = ingredient;

          if (!unit || !amount || !updatedIngredientUnit || !weights) {
            return;
          }

          if (id === ingredientId) {
            ingredient.amount = newAmount;
          } else if (
            isDefined(percent) &&
            isDefined(updatedIngredientPercent)
          ) {
            const currIngredientWeight = getWeightForUnit(weights, unit);
            const oldAmountGrams = amount * currIngredientWeight;
            const percentDiffGrams =
              oldAmountGrams / updatedIngredientOriginalAmountGrams;
            const newAmountGrams =
              updatedIngredientAmountGrams * percentDiffGrams;
            const newAmountInCurrentUnit =
              newAmountGrams / currIngredientWeight;

            ingredient.amount = newAmountInCurrentUnit;
          }
        });

        const updatedTotalYield = calcTotalYield(draft.ingredients);

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

const calcTotalYield = (ingredients: RecipeIngredientsState) => {
  return ingredients.reduce((acc, currIngredient) => {
    const { amount, unit, weights } = currIngredient;

    if (!amount || !unit || !weights) {
      return acc;
    }

    const weight = getWeightForUnit(weights, unit);
    const amountGrams = amount * weight;

    return acc + amountGrams;
  }, 0);
};

const getWeightForUnit = (
  weights: RecipeIngredientState["weights"],
  unit: IngredientUnit,
): number => {
  switch (unit) {
    case "g":
      return 1;
    case "kg":
      return 1000;
    case "dl":
      return (weights.l ?? 1) / 10;
    case "l":
      return weights.l ?? 1;
    case "ts":
      return weights.ts ?? 1;
    case "ss":
      return weights.ss ?? 1;
    default:
      return 1;
  }
};

const updateIngredientUnit = (
  ingredient: WritableDraft<RecipeIngredientState>,
  newUnit: IngredientUnit,
) => {
  if (
    !ingredient ||
    !ingredient.amount ||
    !ingredient.unit ||
    ingredient.unit === newUnit ||
    !isEditableUnit(ingredient.unit)
  ) {
    return;
  }

  const oldWeight = getWeightForUnit(ingredient.weights, ingredient.unit);
  const weight = getWeightForUnit(ingredient.weights, newUnit);

  const oldAmountGrams = (ingredient.amount ?? 0) * oldWeight;
  const newAmount = oldAmountGrams * (1 / weight);

  ingredient.amount = newAmount;
  ingredient.unit = newUnit;
};
