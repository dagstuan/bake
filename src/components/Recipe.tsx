"use client";

import { RecipeQueryResult } from "../../sanity.types";
import Link from "next/link";
import { useState } from "react";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import { recipeIngredientReferenceType } from "@/sanity/schemaTypes/recipeIngredientReference";
import { PortableText } from "./PortableText";

type RecipeProps = {
  recipe: RecipeQueryResult;
};

export const Recipe = ({ recipe }: RecipeProps) => {
  const { title, servings, instructions, ingredients } = recipe ?? {};

  const initialServings = servings ?? 0;

  const [currentServings, setCurrentServings] = useState(initialServings);

  const servingsPercent = currentServings / initialServings;

  const sumDryIngredients = (ingredients ?? []).reduce((acc, ingredient) => {
    if (ingredient.ingredient?.type === "dry") {
      return acc + (ingredient.amount ?? 0);
    }
    return acc;
  }, 0);

  return (
    <main className="container mx-auto prose prose-lg p-4">
      {title ? <h1 className="text-6xl mb-8">{title}</h1> : null}
      {/* {mainImage?.asset?._ref ? (
        <Image
          className="float-left m-0 w-1/3 mr-4 rounded-lg"
          src={urlFor(mainImage?.asset?._ref).width(300).height(300).url()}
          width={300}
          height={300}
          alt={title || ""}
        />
      ) : null} */}
      <div>
        Servings:{" "}
        <input
          type="number"
          value={currentServings}
          onChange={(evt) => setCurrentServings(Number(evt.target.value))}
        />
      </div>
      <div>Sum dry: {sumDryIngredients}</div>
      {ingredients ? (
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Amount</th>
              <th>Percent</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(({ _id, ingredient, amount, unit }) => {
              const { name } = ingredient ?? {};
              const nonNullAmount = amount ?? 0;

              return (
                <tr key={_id}>
                  <td>{name}</td>
                  <td>
                    {nonNullAmount * servingsPercent}
                    {unit}
                  </td>
                  <td>{(nonNullAmount / sumDryIngredients) * 100}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
      {instructions ? (
        <PortableText
          value={instructions}
          types={{
            [recipeIngredientReferenceType.name]: ({ value }) => (
              <RecipeIngredientReferenceResult
                value={value}
                servingsPercent={servingsPercent}
              />
            ),
          }}
        />
      ) : null}
      <hr />
      <Link href="/">&larr; Return home</Link>
    </main>
  );
};
