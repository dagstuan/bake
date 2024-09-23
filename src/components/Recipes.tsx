import { RecipesQueryResult } from "../../sanity.types";

type RecipesProps = {
  recipes: RecipesQueryResult;
};

export const Recipes = ({ recipes }: RecipesProps) => {
  return (
    <main>
      <ul className="container mx-auto grid grid-cols-1 divide-y divide-blue-100">
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <a
              className="block p-4 hover:bg-blue-50"
              href={`/oppskrifter/${recipe?.slug?.current}`}
            >
              {recipe?.title}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
};
