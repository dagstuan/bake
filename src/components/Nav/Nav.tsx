import Link from "next/link";
import { TypographyLink } from "../Typography/TypographyLink";

export const Nav = () => {
  return (
    <nav className="flex w-full items-center justify-between border-b border-b-gray-200 bg-accent px-6 py-4 text-accent-foreground sm:py-5">
      <Link href="/" className="text-4xl">
        🍞
      </Link>
      <ul>
        <li>
          <TypographyLink type="internal" href="/oppskrifter">
            Alle oppskrifter
          </TypographyLink>
        </li>
      </ul>
    </nav>
  );
};
