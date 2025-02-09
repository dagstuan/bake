"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { AllCategoriesQueryResult } from "../../../../sanity.types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { TransitionContext } from "../TransitionContext";

export const categoryQueryParam = "category";
export const searchQueryParam = "query";

interface RecipesFiltersContentProps {
  categories: AllCategoriesQueryResult;
}

export const RecipesFiltersContent = (props: RecipesFiltersContentProps) => {
  const { categories } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const { startTransition } = use(TransitionContext);

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
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
          <MagnifyingGlassIcon className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-500" />
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
              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <Cross2Icon />
            </button>
          )}
        </div>
      </div>
      <div className="-mb-3 flex max-w-full gap-2 overflow-y-auto p-1 pb-3 sm:mb-0 sm:gap-4 sm:p-1">
        <Button
          className="hover:cursor-pointer"
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
              className="hover:cursor-pointer"
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
