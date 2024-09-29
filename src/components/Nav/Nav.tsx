import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="flex w-full items-center justify-between border-b border-b-gray-200 px-6 py-4 sm:py-5">
      <Link href="/" className="text-4xl">
        🍞
      </Link>
      <ul>
        <li>
          <Link
            className="font-medium text-primary underline underline-offset-4"
            href="/oppskrifter"
          >
            Alle oppskrifter
          </Link>
        </li>
      </ul>
    </nav>
  );
};
