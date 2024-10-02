import { cn } from "@/lib/utils";
import Link from "next/link";

type TypographyLinkProps = {
  href: string;
  children: React.ReactNode;
  type: "internal" | "external";
  className?: string;
};

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
        "font-medium text-primary underline underline-offset-4 hover:text-secondary-foreground",
        className,
      )}
    >
      {children}
    </Elem>
  );
};
