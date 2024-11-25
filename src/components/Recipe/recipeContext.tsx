"use client";

import { createContext, useContext, useRef } from "react";
import { RecipeQueryResult } from "../../../sanity.types";
import { calcInitialState } from "./store/initialState";
import { createRecipeStore } from "./store/recipeStore";
import React from "react";

type RecipeStore = ReturnType<typeof createRecipeStore>;

const RecipeStoreContext = createContext<RecipeStore | null>(null);

export interface RecipeContextProviderProps {
  children: React.ReactNode;
  recipe: NonNullable<RecipeQueryResult>;
}

export const RecipeContextProvider = ({
  recipe,
  children,
}: RecipeContextProviderProps): React.JSX.Element => {
  const recipeStore = useRef<RecipeStore>(
    createRecipeStore(
      calcInitialState(recipe),
      `recipe-${recipe._id}`,
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
