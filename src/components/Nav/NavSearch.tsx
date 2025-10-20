"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState, KeyboardEvent, useEffect, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { NavSearchResults } from "./NavSearchResults";
import { RecipesListQueryResult } from "../../../sanity.types";
import { fetchRecipes } from "../RecipesPage/fetchRecipes";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { SpinnerIcon } from "../icons/SpinnerIcon";

export const NavSearch = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] =
    useState<RecipesListQueryResult | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useDebouncedCallback((term: string) => {
    if (!term) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    startTransition(async () => {
      const results = await fetchRecipes(term, null, 6);
      setSearchResults(results);
      setIsOpen(true);
      setIsSearching(false);
    });
  }, 300);

  const handleClear = () => {
    performSearch.cancel();
    setInputValue("");
    setSearchResults(null);
    setIsOpen(false);
    setSelectedIndex(-1);
    setIsSearching(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setSelectedIndex(-1);
    if (newValue) {
      setIsOpen(true);
      setIsSearching(true);
      performSearch(newValue);
    } else {
      handleClear();
    }
  };

  const handleResultClick = (slug: string) => {
    router.push(`/oppskrifter/${slug}`);
    handleClear();
  };

  const handleViewAll = () => {
    router.push(`/oppskrifter?query=${encodeURIComponent(inputValue)}`);
    handleClear();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || !searchResults || searchResults.length === 0) return;

    const maxIndex = searchResults.length; // +1 for "View all" button

    switch (e.key) {
      case "ArrowDown":
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
        break;
      case "ArrowUp":
        setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
        break;
      case "Enter":
        if (selectedIndex === -1 || selectedIndex === searchResults.length) {
          // No selection, go to view all
          handleViewAll();
        } else if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          // Recipe selected
          const slug = searchResults[selectedIndex]?.slug;
          if (slug) {
            handleResultClick(slug);
          }
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative w-full">
        <div className="relative">
          <MagnifyingGlassIcon className="text-accent-foreground absolute top-1/2 left-3 -translate-y-1/2 transform" />
          <PopoverAnchor asChild>
            <Input
              type="text"
              placeholder="Søk..."
              className="bg-background text-accent-foreground w-full pr-10 pl-10"
              onChange={(e) => {
                handleInputChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (inputValue && searchResults) {
                  setIsOpen(true);
                }
              }}
              value={inputValue}
            />
          </PopoverAnchor>
          {inputValue && (
            <button
              onClick={handleClear}
              className="text-accent-foreground absolute top-1/2 right-3 -translate-y-1/2 transform hover:cursor-pointer"
              aria-label="Clear search"
            >
              <Cross2Icon />
            </button>
          )}
        </div>
      </div>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0 md:w-auto md:min-w-[var(--radix-popover-trigger-width)]"
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <div className="max-h-144 overflow-y-auto">
          {(isPending || isSearching) && !searchResults ? (
            <div className="flex items-center justify-center p-6">
              <SpinnerIcon className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <NavSearchResults
              results={searchResults}
              isPending={isPending}
              query={inputValue}
              onResultClick={handleClear}
              onViewAll={handleViewAll}
              selectedIndex={selectedIndex}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
