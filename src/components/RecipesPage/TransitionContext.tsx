"use client";

import {
  createContext,
  ReactNode,
  TransitionFunction,
  TransitionStartFunction,
  useTransition,
} from "react";

interface TransitionContextProviderProps {
  children: ReactNode;
}

export const TransitionContext = createContext<{
  isPending: boolean;
  startTransition: TransitionStartFunction;
}>({
  isPending: false,
  startTransition: (callback: TransitionFunction) => {
    void callback();
  },
});

export const TransitionContextProvider = (
  props: TransitionContextProviderProps,
) => {
  const [isPending, startTransition] = useTransition();

  return (
    <TransitionContext value={{ isPending, startTransition }}>
      {props.children}
    </TransitionContext>
  );
};
