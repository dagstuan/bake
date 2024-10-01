"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  calcInitialState,
  RecipeAction,
  recipeReducer,
  RecipeState,
} from "./recipeReducer";
import { RecipeQueryResult } from "../../../sanity.types";
import useSessionStorage from "@/hooks/useLocalStorage";

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
  const hasInitializedStorage = useRef(false);
  const [isClient, setIsClient] = useState(false);
  const initialState = calcInitialState(recipe);

  const [sessionStorageValue, setSessionStorageValue] = useSessionStorage(
    `recipe-${recipe?._id ?? "unknown"}`,
    initialState,
  );

  const [state, dispatch] = useReducer(recipeReducer, sessionStorageValue);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !hasInitializedStorage.current) {
      hasInitializedStorage.current = true;
      if (sessionStorageValue !== state) {
        dispatch({ type: "reset", payload: sessionStorageValue });
      }
    }
  }, [isClient, sessionStorageValue, state]);

  useEffect(() => {
    if (
      isClient &&
      hasInitializedStorage.current &&
      sessionStorageValue !== state
    ) {
      setSessionStorageValue(state);
    }
  }, [isClient, state, sessionStorageValue]);

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
