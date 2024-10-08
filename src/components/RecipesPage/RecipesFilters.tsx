"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { AllCategoriesQueryResult } from "../../../sanity.types";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { Button } from "../ui/button";

export const categoriesQueryParam = "categories";
export const searchQueryParam = "query";

type RecipesFiltersProps = {
  categories: AllCategoriesQueryResult;
};

export const RecipesFilters = (props: RecipesFiltersProps) => {
  const { categories } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const categoriesQuery =
    searchParams.get(categoriesQueryParam)?.split(",") ?? [];

  const toggleCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);

    const newCategories = categoriesQuery.includes(category)
      ? categoriesQuery.filter((t) => t !== category)
      : [...categoriesQuery, category];

    if (newCategories.length > 0) {
      params.set(categoriesQueryParam, newCategories.sort().join(","));
    } else {
      params.delete(categoriesQueryParam);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchQueryParam, term);
    } else {
      params.delete(searchQueryParam);
    }
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  const [inputValue, setInputValue] = useState(
    searchParams.get(searchQueryParam)?.toString() ?? "",
  );

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    handleSearch(newValue);
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500" />
          <Input
            type="text"
            placeholder="Søk..."
            className="w-full pl-10"
            onChange={(e) => {
              handleInputChange(e.target.value);
            }}
            value={inputValue}
          />
          {inputValue && (
            <button
              onClick={() => handleInputChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <Cross2Icon />
            </button>
          )}
        </div>
      </div>
      <div className="flex gap-4">
        {categories.map((category) => {
          const { _id, title, slug } = category;

          if (!_id || !title || !slug) {
            return null;
          }

          return (
            <Button
              variant={categoriesQuery.includes(slug) ? "default" : "outline"}
              onClick={() => toggleCategory(slug)}
              key={_id}
            >
              {title}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
