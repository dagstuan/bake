"use client";

import { createContext, useContext, useRef } from "react";
import { RecipeQueryResult } from "../../../sanity.types";
import { calcInitialState } from "./store/initialState";
import { createRecipeStore } from "./store/recipeStore";

type RecipeStore = ReturnType<typeof createRecipeStore>;

const RecipeStoreContext = createContext<RecipeStore | null>(null);

export type RecipeContextProviderProps = {
  children: React.ReactNode;
  recipe: NonNullable<RecipeQueryResult>;
};

export const RecipeContextProvider = ({
  recipe,
  children,
}: RecipeContextProviderProps): JSX.Element => {
  const recipeStore = useRef<RecipeStore>(
    createRecipeStore(
      calcInitialState(recipe),
      `recipe-${recipe?._id ?? "unknown"}`,
      recipe._rev,
    ),
  ).current;

  return (
    <RecipeStoreContext.Provider value={recipeStore}>
      {children}
    </RecipeStoreContext.Provider>
  );
};

export const useRecipeContext = () => {
  const store = useContext(RecipeStoreContext);

  if (!store) {
    throw Error(
      "useRecipeContext must be used within a RecipeStoreContext.Provider",
    );
  }

  return store;
};
