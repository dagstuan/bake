import { PortableText as SanityPortableText } from "next-sanity";
import { ComponentProps, useMemo } from "react";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyH3 } from "../Typography/TypographyH3";
import { TypographyP } from "../Typography/TypographyP";
import { TypographyLink } from "../Typography/TypographyLink";
import ImageBox, { BlockContentImage } from "./ImageBox";
import { Highlight } from "./Highlight";
import { Alert } from "../../../sanity.types";
import { PortableTextAlert } from "./PortableTextAlert";
import { alertTypeName } from "@/sanity/schemaTypes/constants";

type SanityPortableTextProps = ComponentProps<typeof SanityPortableText>;

type Components = NonNullable<SanityPortableTextProps["components"]>;

export type PortableTextProps = {
  value: SanityPortableTextProps["value"];
  types?: Components["types"];
  marks?: Components["marks"];
  block?: Components["block"];
};

const components: Components = {
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 ml-6 list-disc marker:text-primary [&>li]:mt-2">
        {children}
      </ul>
    ),
  },
  listItem: ({ children }) => <li>{children}</li>,
  types: {
    image: ({ value }: { value: BlockContentImage }) => {
      return (
        <div className="my-6 space-y-2">
          <ImageBox image={value} />
        </div>
      );
    },
    [alertTypeName]: ({ value }: { value: Alert }) => (
      <PortableTextAlert value={value} />
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
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

  const memoedComponents = useMemo<Components>(() => {
    return {
      ...components,
      types: typesObj,
      marks: marksObj,
      block: blockObj,
    };
  }, [typesObj, blockObj, marksObj]);

  return <SanityPortableText {...props} components={memoedComponents} />;
};
