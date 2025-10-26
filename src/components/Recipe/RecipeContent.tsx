import { RecipeQueryResult } from "../../../sanity.types";
import { RecipeHeader } from "./Header/RecipeHeader";
import { RecipeSidebar } from "./Sidebar/RecipeSidebar";
import { RecipeText } from "./RecipeText";

interface RecipeContentProps {
  recipe: NonNullable<RecipeQueryResult>;
  slug: string;
}

export const RecipeContent = ({ recipe, slug }: RecipeContentProps) => {
  const { title, mainImage } = recipe;

  return (
    <main className="px-6">
      <div className="prose-lg prose container mx-auto flex max-w-5xl flex-col gap-8 pt-10 sm:pt-16">
        <RecipeHeader title={title} mainImage={mainImage} slug={slug} />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(320px,1fr)_3fr] md:gap-8">
          <RecipeSidebar recipe={recipe} />
          <RecipeText recipe={recipe} />
        </div>
      </div>
    </main>
  );
};
