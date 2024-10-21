import { cn } from "@/lib/utils";
import Link from "next/link";
import { ComponentProps } from "react";

type TypographyLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
} & (
  | {
      type: "external";
    }
  | ({
      type: "internal";
    } & ComponentProps<typeof Link>)
);

export const TypographyLink = ({
  href,
  children,
  type,
  className,
}: TypographyLinkProps) => {
  const Elem = type === "internal" ? Link : "a";

  return (
    <Elem
      href={href}
      className={cn(
        "font-medium text-primary underline-offset-4 hover:text-secondary-foreground hover:underline",
        className,
      )}
    >
      {children}
    </Elem>
  );
};
