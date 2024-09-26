import { PortableText as SanityPortableText } from "next-sanity";
import { ComponentProps } from "react";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyH3 } from "../Typography/TypographyH3";
import { TypographyP } from "../Typography/TypographyP";

type SanityPortableTextProps = ComponentProps<typeof SanityPortableText>;

type Components = NonNullable<SanityPortableTextProps["components"]>;

export type PortableTextProps = {
  value: SanityPortableTextProps["value"];
  types: Components["types"];
};

const components: Components = {
  block: {
    normal: ({ children }) => <TypographyP>{children}</TypographyP>,
    h2: ({ children }) => <TypographyH2>{children}</TypographyH2>,
    h3: ({ children }) => <TypographyH3>{children}</TypographyH3>,
  },
};

export const PortableText = (props: PortableTextProps) => {
  const { types } = props;

  return (
    <SanityPortableText
      {...props}
      components={{ ...components, types: { ...components.types, ...types } }}
    />
  );
};
