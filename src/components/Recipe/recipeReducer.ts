import { Ingredient, RecipeQueryResult } from "../../../sanity.types";
import { RecipeIngredients, RecipeInstructions } from "./types";

export const minServings = 1;
export const maxServings = 999;

export type IngredientsCompletionState = {
  [ingredientId: string]: {
    [recipeIngredientKey: string]: {
      completed: boolean;
    };
  };
};

type RecipeIngredientType = {
  ingredientId: string;
  name: string;
  percent: number;
  amount: number;
  unit: string;
  type: NonNullable<Ingredient["type"]>;
};

export type RecipeIngredientsState = Array<RecipeIngredientType>;

export type RecipeState = {
  recipeRevision: string;
  initialServings: number;
  servings: number;
  ingredientsCompletion: IngredientsCompletionState;
  ingredients: RecipeIngredientsState;
  yieldPerServing: number;
};

export const calcIngredientAmount = (
  percent: number,
  baseIngredientsAmount: number,
): number => baseIngredientsAmount * (percent / 100);

export const calcInitialIngredientsCompletionState = (
  instructions: RecipeInstructions | null | undefined,
): IngredientsCompletionState => {
  if (!instructions) {
    return {};
  }

  return instructions.reduce<IngredientsCompletionState>(
    (state, instruction) => {
      const ingredientReferences = instruction.children?.filter(
        (x) => x._type === "recipeIngredientReference",
      );

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
    },
    {},
  );
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
  return Object.entries(
    ingredientsCompletionState,
  ).reduce<IngredientsCompletionState>(
    (state, [ingredientId, ingredientCompletion]) => {
      state[ingredientId] = Object.entries(ingredientCompletion).reduce<{
        [recipeIngredientKey: string]: { completed: boolean };
      }>((ingredientState, [recipeIngredientKey]) => {
        ingredientState[recipeIngredientKey] = { completed };
        return ingredientState;
      }, {});

      return state;
    },
    {},
  );
};

const calcInitialRecipeIngredientsState = (
  baseDryIngredients: number,
  recipeIngredientsQueryResult: RecipeIngredients | null | undefined,
): RecipeIngredientsState => {
  return (
    recipeIngredientsQueryResult
      ?.map((ingredientRef): RecipeIngredientType | null => {
        const { _id, ingredient, percent, unit } = ingredientRef ?? {};

        if (
          !_id ||
          !ingredient ||
          !ingredient.name ||
          !ingredient.type ||
          !percent ||
          !unit
        ) {
          return null;
        }

        return {
          ingredientId: _id,
          name: ingredient.name,
          percent: percent,
          amount: calcIngredientAmount(percent, baseDryIngredients),
          unit: unit,
          type: ingredient.type,
        };
      })
      .filter((r) => r != null) ?? []
  );
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
      payload: boolean;
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
  | { type: "reset"; payload: RecipeState };

export const calcInitialState = (
  recipe: NonNullable<RecipeQueryResult>,
): RecipeState => {
  const { _rev, servings, instructions, ingredients, baseDryIngredients } =
    recipe;

  const initialServingsNum = servings ?? 1;
  const initialDryIngredients = baseDryIngredients ?? 1000;

  const ingredientsState = calcInitialRecipeIngredientsState(
    initialDryIngredients,
    ingredients,
  );

  const totalYield = ingredientsState.reduce(
    (acc, curr) => acc + curr.amount,
    0,
  );

  return {
    recipeRevision: _rev,
    initialServings: initialServingsNum,
    servings: initialServingsNum,
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

      const currentIngredient = state.ingredientsCompletion[ingredientId];
      const currentKeyStatus =
        currentIngredient[ingredientReferenceKey]?.completed ?? false;

      const updatedIngredient = {
        ...currentIngredient,
        [ingredientReferenceKey]: {
          completed: !currentKeyStatus,
        },
      };

      return {
        ...state,
        ingredientsCompletion: {
          ...state.ingredientsCompletion,
          [ingredientId]: updatedIngredient,
        },
      };
    }
    case "onIngredientCompletionChange": {
      const { ingredientId, completed } = action.payload;

      const updatedIngredient = Object.entries(
        state.ingredientsCompletion[ingredientId],
      ).reduce<{
        [recipeIngredientKey: string]: { completed: boolean };
      }>((ingredientState, [recipeIngredientKey]) => {
        ingredientState[recipeIngredientKey] = { completed: completed };
        return ingredientState;
      }, {});

      return {
        ...state,
        ingredientsCompletion: {
          ...state.ingredientsCompletion,
          [ingredientId]: updatedIngredient,
        },
      };
    }
    case "onAllIngredientsCompletionChange": {
      const completed = action.payload;

      return {
        ...state,
        ingredientsCompletion: resetIngredientsCompletionState(
          state.ingredientsCompletion,
          completed,
        ),
      };
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
      const updatedIngredients = state.ingredients.map((ingredient) => {
        const updatedAmount = ingredient.amount * changePercent;
        return { ...ingredient, amount: updatedAmount };
      });

      return {
        ...state,
        ingredientsCompletion: resetIngredientsCompletionState(
          state.ingredientsCompletion,
          false,
        ),
        servings: newServings,
        ingredients: updatedIngredients,
        yieldPerServing: state.yieldPerServing,
      };
    }
    case "onIngredientChange": {
      const { newAmount, ingredientId } = action.payload;

      if (newAmount === 0 || isNaN(newAmount)) {
        return state;
      }

      const ingredientToUpdate = state.ingredients.find(
        (ingredient) => ingredient.ingredientId === ingredientId,
      );

      if (!ingredientToUpdate) {
        return state;
      }

      const { percent: updatedIngredientPercent } = ingredientToUpdate;

      const updatedIngredients = state.ingredients.map((ingredient) => {
        if (ingredient.ingredientId === ingredientId) {
          return { ...ingredient, amount: newAmount };
        }

        const updatedAmount =
          (ingredient.percent / updatedIngredientPercent) * newAmount;

        return { ...ingredient, amount: updatedAmount };
      });

      const updatedTotalYield = updatedIngredients.reduce(
        (acc, curr) => acc + curr.amount,
        0,
      );

      const updatedServings = updatedTotalYield / state.yieldPerServing;

      return {
        ...state,
        ingredientsCompletion: resetIngredientsCompletionState(
          state.ingredientsCompletion,
          false,
        ),
        servings: updatedServings,
        ingredients: updatedIngredients,
        yieldPerServing: state.yieldPerServing,
      };
    }
    case "reset":
      return action.payload;
    default:
      return state;
  }
};
