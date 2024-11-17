"use client";

import {
  createContext,
  Dispatch,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { RecipeAction, recipeReducer } from "./reducer/recipeReducer";
import { RecipeQueryResult } from "../../../sanity.types";
import useStorage from "@/hooks/useStorage";
import * as v from "valibot";
import { RecipeState, recipeStateSchema } from "./reducer/types";
import { calcInitialState } from "./reducer/initialState";

type RecipeContextState = RecipeState & {
  dispatch: React.Dispatch<RecipeAction>;
};

const RecipeContext = createContext<RecipeContextState | null>(null);

export type RecipeContextProviderProps = {
  children: React.ReactNode;
  recipe: NonNullable<RecipeQueryResult>;
};

const useReducerWithLocalStorage = (
  key: string,
  reducer: typeof recipeReducer,
  initialState: RecipeState,
): [RecipeState, Dispatch<RecipeAction>] => {
  const [isClient, setIsClient] = useState(false);
  const hasInitializedStorage = useRef(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [localStorageValue, setLocalStorageValue] = useStorage(
    key,
    initialState,
    "localStorage",
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !hasInitializedStorage.current) {
      hasInitializedStorage.current = true;

      const parseResult = v.safeParse(recipeStateSchema, localStorageValue);

      if (
        parseResult.success &&
        parseResult.output.recipeRevision === state.recipeRevision
      ) {
        dispatch({ type: "reset", payload: localStorageValue });
      }
    }
  }, [isClient, localStorageValue, state]);

  useEffect(() => {
    if (
      isClient &&
      hasInitializedStorage.current &&
      localStorageValue !== state
    ) {
      setLocalStorageValue(state);
    }
  }, [isClient, state, localStorageValue, setLocalStorageValue]);

  return [state, dispatch];
};

export const RecipeContextProvider = ({
  recipe,
  children,
}: RecipeContextProviderProps): JSX.Element => {
  const [state, dispatch] = useReducerWithLocalStorage(
    `recipe-${recipe?._id ?? "unknown"}`,
    recipeReducer,
    calcInitialState(recipe),
  );

  return (
    <RecipeContext.Provider
      value={{
        ...state,
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
