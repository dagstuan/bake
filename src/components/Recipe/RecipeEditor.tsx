"use client";

import { ComponentProps, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { RecipeEditorContent } from "./RecipeEditorContent";
import { RecipeIngredientsState } from "./recipeReducer";

type RecipeEditorProps = ComponentProps<typeof RecipeEditorContent>;

export const RecipeEditor = ({ onSubmit, ...rest }: RecipeEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (
    servings: number,
    ingredients: RecipeIngredientsState,
  ) => {
    setIsOpen(false);
    onSubmit(servings, ingredients);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Rediger oppskrift</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <RecipeEditorContent {...rest} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
};
