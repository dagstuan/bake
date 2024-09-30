import { Ingredient, RecipeQueryResult } from "../../../sanity.types";
import { RecipeIngredients, RecipeInstructions } from "./types";
import { calcIngredientAmount } from "./utils";

export const minServings = 1;
export const maxServings = 999;

type IngredientsCompletionState = {
  [ingredientId: string]: {
    [recipeIngredientKey: string]: {
      completed: boolean;
    };
  };
};

export type RecipeIngredientsState = Array<{
  ingredientId: string;
  name: string;
  percent: number;
  amount: number;
  unit: string;
  type: NonNullable<Ingredient["type"]>;
}>;

export type RecipeState = {
  servings: number;
  ingredientsCompletion: IngredientsCompletionState;
  ingredients: RecipeIngredientsState;
  yieldPerServing: number;
};

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

const resetIngredientsCompletionState = (
  ingredientsCompletionState: IngredientsCompletionState,
): IngredientsCompletionState => {
  return Object.entries(
    ingredientsCompletionState,
  ).reduce<IngredientsCompletionState>(
    (state, [ingredientId, ingredientCompletion]) => {
      state[ingredientId] = Object.entries(ingredientCompletion).reduce<{
        [recipeIngredientKey: string]: { completed: boolean };
      }>((ingredientState, [recipeIngredientKey]) => {
        ingredientState[recipeIngredientKey] = { completed: false };
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
    recipeIngredientsQueryResult?.map((ingredientRef) => {
      const { _id, ingredient, percent, unit } = ingredientRef ?? {};

      const { name, type } = ingredient ?? {};

      return {
        ingredientId: _id ?? "",
        name: name ?? "",
        percent: percent ?? 0,
        amount: calcIngredientAmount(percent ?? 0, baseDryIngredients),
        unit: unit ?? "",
        type: type ?? "dry",
      };
    }) ?? []
  );
};

type RecipeAction =
  | {
      type: "onIngredientReferenceCompletionChange";
      payload: {
        ingredientId: string;
        ingredientReferenceKey: string;
      };
    }
  | {
      type: "onRecipeChange";
      payload: {
        servings: number;
        ingredients: RecipeIngredientsState;
      };
    }
  | { type: "reset"; payload: RecipeState };

export const calcInitialState = (recipe: RecipeQueryResult): RecipeState => {
  const { servings, instructions, ingredients, baseDryIngredients } =
    recipe ?? {};

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
    case "onRecipeChange":
      return {
        ...state,
        servings: action.payload.servings,
        ingredients: action.payload.ingredients,
        ingredientsCompletion: resetIngredientsCompletionState(
          state.ingredientsCompletion,
        ),
      };
    case "reset":
      return action.payload;
    default:
      return state;
  }
};
