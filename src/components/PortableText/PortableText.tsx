import { PortableText as SanityPortableText } from "next-sanity";
import { ComponentProps, useMemo } from "react";
import { TypographyH2 } from "../Typography/TypographyH2";
import { TypographyH3 } from "../Typography/TypographyH3";
import { TypographyP } from "../Typography/TypographyP";
import { TypographyLink } from "../Typography/TypographyLink";
import { type BlockContentImage } from "./ImageBox";
import { Highlight } from "./Highlight";
import { Alert } from "../../../sanity.types";
import { PortableTextAlert } from "./PortableTextAlert";
import {
  alertTypeName,
  imageGalleryTypeName,
} from "@/sanity/schemaTypes/constants";
import { type BlockContentImageGallery } from "./ImageGallery/ImageGallery";
import { TypographyH4 } from "../Typography/TypographyH4";
import dynamic from "next/dynamic";

const ImageBox = dynamic(() => import("./ImageBox"));

const ImageGallery = dynamic(() =>
  import("./ImageGallery/ImageGallery").then((mod) => mod.ImageGallery),
);

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
    number: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
  },
  listItem: ({ children }) => <li>{children}</li>,
  types: {
    image: ({ value }: { value: BlockContentImage }) => {
      return <ImageBox image={value} />;
    },
    [alertTypeName]: ({ value }: { value: Alert }) => (
      <PortableTextAlert value={value} />
    ),
    [imageGalleryTypeName]: ({
      value,
    }: {
      value: BlockContentImageGallery;
    }) => <ImageGallery value={value} />,
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
    h4: ({ children }) => <TypographyH4>{children}</TypographyH4>,
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
