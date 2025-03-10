import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle";
import { NavLink } from "./NavLink";

export const Nav = () => {
  return (
    <nav className="bg-secondary border-b px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between py-4 sm:py-5">
        <Link href="/" className="text-4xl">
          🍞
        </Link>
        <ul className="flex items-center gap-2">
          <li>
            <NavLink href="/om">Om</NavLink>
          </li>
          <li>
            <NavLink href="/oppskrifter">Oppskrifter</NavLink>
          </li>
          <li>
            <DarkModeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
};
