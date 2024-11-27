"use client";

import Link from "next/link";
import { TypographyLink } from "../Typography/TypographyLink";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { OmitStrict } from "@/utils/types";
import { DarkModeToggle } from "../DarkModeToggle";
import { Button } from "../ui/button";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
} & OmitStrict<
  Extract<ComponentProps<typeof TypographyLink>, { type: "internal" }>,
  "href" | "type"
>;

const NavLink = ({ href, children, active = false }: NavLinkProps) => (
  <Button asChild variant={active ? "default" : "outline"}>
    <Link href={href}>{children}</Link>
  </Button>
);

export const Nav = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-secondary px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between py-4 sm:py-5">
        <Link href="/" className="text-4xl">
          🍞
        </Link>
        <ul className="flex items-center gap-2">
          <li>
            <NavLink href="/om" active={pathname === "/om"}>
              Om
            </NavLink>
          </li>
          <li>
            <NavLink
              href="/oppskrifter"
              prefetch
              active={pathname.startsWith("/oppskrifter")}
            >
              Oppskrifter
            </NavLink>
          </li>
          <li>
            <DarkModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};
