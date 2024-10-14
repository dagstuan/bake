import { ReactNode } from "react";

export const HighlightDecorator = (props: { children: ReactNode }) => (
  <span
    style={{
      backgroundColor: "lightgrey",
      fontWeight: "bold",
      color: "black",
    }}
  >
    {props.children}
  </span>
);
