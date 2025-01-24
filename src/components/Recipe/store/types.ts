import * as v from "valibot";

const ingredientsCompletionSchema = v.record(
  v.string(),
  v.nullable(
    v.record(
      v.string(),
      v.object({
        completed: v.boolean(),
      }),
    ),
  ),
);
export type IngredientsCompletionState = v.InferInput<
  typeof ingredientsCompletionSchema
>;

const ingredientsGroupOrderSchema = v.array(v.string());
export type IngredientsGroupOrder = v.InferInput<
  typeof ingredientsGroupOrderSchema
>;

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

const weights = v.object({
  l: v.nullable(v.number()),
  ss: v.nullable(v.number()),
  ts: v.nullable(v.number()),
});

const conversions = v.array(
  v.object({
    to: v.string(),
    rate: v.number(),
    weights: weights,
  }),
);
export type Conversions = v.InferInput<typeof conversions>;

const recipeIngredientStateSchema = v.object({
  id: v.string(),
  name: v.string(),
  group: v.nullable(v.string()),
  percent: v.optional(v.number()),
  amount: v.optional(v.number()),
  unit: v.optional(v.union([ingredientUnit, v.undefined(), v.null()])),
  weights: weights,
  comment: v.optional(v.nullable(v.string())),
  conversions,
});

export type RecipeIngredientState = v.InferInput<
  typeof recipeIngredientStateSchema
>;

const recipeIngredientsStateSchema = v.array(recipeIngredientStateSchema);
export type RecipeIngredientsState = v.InferInput<
  typeof recipeIngredientsStateSchema
>;

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
