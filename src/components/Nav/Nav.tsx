import Link from "next/link";
import { DarkModeToggle } from "../DarkModeToggle/DarkModeToggle";
import { NavLink } from "./NavLink";
import { NavSearch } from "./NavSearch";

export const Nav = () => {
  return (
    <nav className="bg-secondary border-b px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 py-4 pb-2 sm:py-5">
        <Link href="/" className="text-4xl">
          🍞
        </Link>
        <ul className="flex items-center gap-2">
          <li className="hidden flex-1 justify-center md:flex">
            <NavSearch />
          </li>
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
      <div className="mx-auto w-full pb-4 md:hidden">
        <NavSearch />
      </div>
    </nav>
  );
};
