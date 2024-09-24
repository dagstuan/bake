import { PortableText as SanityPortableText } from "next-sanity";
import { ComponentProps } from "react";

type SanityPortableTextProps = ComponentProps<typeof SanityPortableText>;

type Components = NonNullable<SanityPortableTextProps["components"]>;

export type PortableTextProps = {
  value: SanityPortableTextProps["value"];
  types: Components["types"];
};

const components: Components = {
  block: {
    h2: ({ children }) => <h2 className="text-4xl mb-4">{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
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
