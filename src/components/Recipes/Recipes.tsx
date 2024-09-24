import { AllRecipesQueryResult } from "../../../sanity.types";

type RecipesProps = {
  recipes: AllRecipesQueryResult;
};

export const Recipes = ({ recipes }: RecipesProps) => {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto grid grid-cols-1 divide-y divide-blue-100">
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
      </div>
    </main>
  );
};
