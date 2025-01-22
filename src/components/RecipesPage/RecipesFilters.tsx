"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TransitionStartFunction, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AllCategoriesQueryResult } from "../../../sanity.types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const categoryQueryParam = "category";
export const searchQueryParam = "query";

interface RecipesFiltersProps {
  startTransition: TransitionStartFunction;
  categories: AllCategoriesQueryResult;
}

export const RecipesFilters = (props: RecipesFiltersProps) => {
  const { categories, startTransition } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const categoryQuery = searchParams.get(categoryQueryParam);

  const setCategory = (newCategory: string | null) => {
    const params = new URLSearchParams(searchParams);

    if (newCategory === categoryQuery) return;

    if (!newCategory) {
      params.delete(categoryQueryParam);
    } else if (categoryQuery !== newCategory) {
      params.set(categoryQueryParam, newCategory);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set(searchQueryParam, term);
    } else {
      params.delete(searchQueryParam);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 300);

  const [inputValue, setInputValue] = useState(
    searchParams.get(searchQueryParam)?.toString() ?? "",
  );

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    handleSearch(newValue);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 sm:gap-6">
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
              onClick={() => {
                handleInputChange("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <Cross2Icon />
            </button>
          )}
        </div>
      </div>
      <div className="-mb-3 flex max-w-full gap-2 overflow-y-auto p-1 pb-3 sm:mb-0 sm:gap-4 sm:p-1">
        <Button
          variant={!categoryQuery ? "default" : "outline"}
          onClick={() => {
            setCategory(null);
          }}
        >
          Alle
        </Button>
        {categories.map((category) => {
          const { _id, title, slug } = category;

          if (!_id || !title || !slug) {
            return null;
          }

          return (
            <Button
              variant={categoryQuery === slug ? "default" : "outline"}
              onClick={() => {
                setCategory(slug);
              }}
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
