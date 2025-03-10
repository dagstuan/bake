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
    <Button asChild variant={active ? "default" : "outline"}>
      <Link href={href}>{children}</Link>
    </Button>
  );
};
