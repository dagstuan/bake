import { ReactNode } from "react";
import {
  isPortableTextMarkLink,
  PortableTextMarkLink as PortableTextMarkLinkType,
} from "./types";
import { TypographyLink } from "../Typography/TypographyLink";

export interface ResolvedLink {
  href: string;
  type: "internal" | "external";
}

type InternalLink = PortableTextMarkLinkType["internalReference"];

export const resolvePageUrl = (internalLink: InternalLink): string | null => {
  if (!internalLink) {
    return null;
  }

  const { slug, _type } = internalLink;

  switch (_type) {
    case "about":
      return `/om`;
    case "recipe":
      return `/oppskrifter/${slug}`;
    default:
      return "/";
  }
};

export const resolveHrefForLink = (
  link: PortableTextMarkLinkType | null,
): ResolvedLink | null => {
  if (link != null) {
    if (link.linkType === "internal" && link.internalReference) {
      const resolvedUrl = resolvePageUrl(link.internalReference);

      if (!resolvedUrl) {
        return null;
      }

      return {
        href: resolvedUrl,
        type: link.linkType,
      };
    } else if (link.linkType === "external" && link.href) {
      return {
        href: link.href,
        type: link.linkType,
      };
    }
  }

  return null;
};

interface PortableTextMarkLinkProps {
  value: unknown;
  children: ReactNode;
}

export function PortableTextMarkLink(props: PortableTextMarkLinkProps) {
  const { value, children } = props;

  if (!isPortableTextMarkLink(value)) {
    return children;
  }

  const resolvedLink = resolveHrefForLink(value);

  if (!resolvedLink) {
    return children;
  }

  return (
    <TypographyLink href={resolvedLink.href} type={resolvedLink.type}>
      {children}
    </TypographyLink>
  );
}
