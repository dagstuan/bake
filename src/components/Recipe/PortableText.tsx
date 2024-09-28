import { PortableText as SanityPortableText } from "next-sanity";
import { ComponentProps } from "react";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyH3 } from "../Typography/TypographyH3";
import { TypographyP } from "../Typography/TypographyP";
import { TypographyLink } from "../Typography/TypographyLink";

type SanityPortableTextProps = ComponentProps<typeof SanityPortableText>;

type Components = NonNullable<SanityPortableTextProps["components"]>;

export type PortableTextProps = {
  value: SanityPortableTextProps["value"];
  types: Components["types"];
  marks?: Components["marks"];
  block?: Components["block"];
};

const components: Components = {
  marks: {
    link: ({ value, children }) => {
      const { href } = value;

      return (
        <TypographyLink href={href} type="external">
          {children}
        </TypographyLink>
      );
    },
  },
  block: {
    normal: ({ children }) => <TypographyP>{children}</TypographyP>,
    h2: ({ children }) => <TypographyH2>{children}</TypographyH2>,
    h3: ({ children }) => <TypographyH3>{children}</TypographyH3>,
  },
} as const;

export const PortableText = (props: PortableTextProps) => {
  const { types, block, marks } = props;

  const blockObj = { ...components.block, ...block };
  const marksObj = { ...components.marks, ...marks };

  return (
    <SanityPortableText
      {...props}
      components={{
        types: { ...components.types, ...types },
        marks: marksObj,
        block: blockObj,
      }}
    />
  );
};
