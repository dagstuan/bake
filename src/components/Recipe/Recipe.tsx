"use client";

import { RecipeQueryResult } from "../../../sanity.types";
import Link from "next/link";
import { useState } from "react";
import { RecipeIngredientReferenceResult } from "./RecipeIngredientReference";
import { recipeIngredientReferenceType } from "@/sanity/schemaTypes/recipeIngredientReference";
import { PortableText } from "./PortableText";
import { Input } from "../ui/input";

type RecipeProps = {
  recipe: RecipeQueryResult;
};

export const Recipe = ({ recipe }: RecipeProps) => {
  const { title, servings, baseDryIngredients, instructions, ingredients } =
    recipe ?? {};

  const initialServings = servings ?? 0;

  const [currentServings, setCurrentServings] = useState(initialServings);

  const servingsPercent = currentServings / initialServings;

  const currentSumDryIngredients = (baseDryIngredients ?? 0) * servingsPercent;

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
        <Input
          type="number"
          value={currentServings}
          onChange={(evt) => setCurrentServings(Number(evt.target.value))}
        />
      </div>

      <div>Sum dry: {currentSumDryIngredients}</div>
      {ingredients ? (
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Percent</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(({ _id, ingredient, percent }) => {
              const { name } = ingredient ?? {};
              const percentNum = percent ?? 0;

              return (
                <tr key={_id}>
                  <td>{name}</td>
                  <td>{percent}%</td>
                  <td>
                    {(currentSumDryIngredients * (percentNum / 100)).toFixed()}g
                  </td>
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
                sumDryIngredients={currentSumDryIngredients}
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
