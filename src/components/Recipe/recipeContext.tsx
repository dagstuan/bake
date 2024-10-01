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
  recipe: NonNullable<RecipeQueryResult>;
};

const useReducerWithSessionStorage = (
  key: string,
  reducer: typeof recipeReducer,
  initialState: RecipeState,
): [RecipeState, Dispatch<RecipeAction>] => {
  const [isClient, setIsClient] = useState(false);
  const hasInitializedStorage = useRef(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [sessionStorageValue, setSessionStorageValue] = useSessionStorage(
    key,
    initialState,
  );

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
  }, [isClient, state, sessionStorageValue, setSessionStorageValue]);

  return [state, dispatch];
};

export const RecipeContextProvider = ({
  recipe,
  children,
}: RecipeContextProviderProps): JSX.Element => {
  const [state, dispatch] = useReducerWithSessionStorage(
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
