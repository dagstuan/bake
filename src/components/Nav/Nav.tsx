import Link from "next/link";

export const Nav = () => {
  return (
    <nav className="w-full p-5 border-b border-b-gray-200 flex justify-between items-center">
      <div className="text-4xl">🍞</div>
      <ul>
        <li>
          <Link href="/oppskrifter">Oppskrifter</Link>
        </li>
      </ul>
    </nav>
  );
};
