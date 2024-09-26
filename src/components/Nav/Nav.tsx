import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="flex w-full items-center justify-between border-b border-b-gray-200 p-5">
      <a href="/" className="text-4xl">
        🍞
      </a>
      <ul>
        <li>
          <Link href="/oppskrifter">Oppskrifter</Link>
        </li>
      </ul>
    </nav>
  );
};
