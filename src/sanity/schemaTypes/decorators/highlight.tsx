import { ReactNode } from "react";

export const HighlightDecorator = (props: { children: ReactNode }) => (
  <span
    style={{
      backgroundColor: "lightgrey",
      fontWeight: "bold",
      color: "black",
      padding: "0 0.2em",
    }}
  >
    {props.children}
  </span>
);
