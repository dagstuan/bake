import { PortableText as SanityPortableText } from "next-sanity";
import { ComponentProps, useMemo } from "react";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyH3 } from "../Typography/TypographyH3";
import { TypographyP } from "../Typography/TypographyP";
import { TypographyLink } from "../Typography/TypographyLink";
import ImageBox, { BlockContentImage } from "./ImageBox";
import { Highlight } from "./Highlight";

type SanityPortableTextProps = ComponentProps<typeof SanityPortableText>;

type Components = NonNullable<SanityPortableTextProps["components"]>;

export type PortableTextProps = {
  value: SanityPortableTextProps["value"];
  types?: Components["types"];
  marks?: Components["marks"];
  block?: Components["block"];
};

const components: Components = {
  types: {
    image: ({ value }: { value: BlockContentImage }) => {
      return (
        <div className="my-6 space-y-2">
          <ImageBox image={value} />
        </div>
      );
    },
  },
  marks: {
    highlight: ({ children }) => <Highlight>{children}</Highlight>,
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

  const typesObj = useMemo(() => ({ ...components.types, ...types }), [types]);
  const blockObj = useMemo(() => ({ ...components.block, ...block }), [block]);
  const marksObj = useMemo(() => ({ ...components.marks, ...marks }), [marks]);

  return (
    <SanityPortableText
      {...props}
      components={{
        types: typesObj,
        marks: marksObj,
        block: blockObj,
      }}
    />
  );
};
