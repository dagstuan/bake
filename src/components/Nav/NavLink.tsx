"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export const NavLink = ({ href, children }: NavLinkProps) => {
  const pathname = usePathname();

  const active = pathname.startsWith(href);

  return (
    <Button
      variant={active ? "default" : "outline"}
      render={<Link href={href} />}
      nativeButton={false}
    >
      {children}
    </Button>
  );
};
