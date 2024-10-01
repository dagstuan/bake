import { createContext, useContext, useReducer } from "react";
import {
  calcInitialState,
  RecipeAction,
  recipeReducer,
  RecipeState,
} from "./recipeReducer";
import { RecipeQueryResult } from "../../../sanity.types";

type RecipeContextState = RecipeState & {
  dispatch: React.Dispatch<RecipeAction>;
};

const RecipeContext = createContext<RecipeContextState | null>(null);

export type RecipeContextProviderProps = {
  children: React.ReactNode;
  recipe: RecipeQueryResult;
};

export const RecipeContextProvider = ({
  recipe,
  children,
}: RecipeContextProviderProps): JSX.Element => {
  const [
    { ingredients, ingredientsCompletion, servings, yieldPerServing },
    dispatch,
  ] = useReducer(recipeReducer, calcInitialState(recipe));

  return (
    <RecipeContext.Provider
      value={{
        ingredients,
        ingredientsCompletion,
        servings,
        yieldPerServing,
        dispatch,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = (): RecipeContextState => {
  const context = useContext(RecipeContext);

  if (!context) {
    throw Error("useComboboxContext must be used within a Recipe provider");
  }

  return context;
};
