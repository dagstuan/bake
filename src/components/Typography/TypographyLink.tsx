import Link from "next/link";

type TypographyLinkProps = {
  href: string;
  children: React.ReactNode;
  type: "internal" | "external";
};

export const TypographyLink = ({
  href,
  children,
  type,
}: TypographyLinkProps) => {
  const Elem = type === "internal" ? Link : "a";

  return (
    <Elem
      href={href}
      className="font-medium text-primary underline underline-offset-4"
    >
      {children}
    </Elem>
  );
};
