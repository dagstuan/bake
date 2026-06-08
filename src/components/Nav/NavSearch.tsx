"use client";

import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import type { BaseUIEvent } from "@base-ui/react/types";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, KeyboardEvent, useRef, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { RecipesListQueryResult } from "../../../sanity.types";
import { fetchRecipes } from "../RecipesPage/fetchRecipes";
import { SpinnerIcon } from "../icons/SpinnerIcon";
import Image from "next/image";
import { Clock3 } from "lucide-react";
import { formatDurationShort } from "@/utils/durationUtils";
import { urlForImage } from "@/sanity/lib/utils";
import { VisuallyHidden } from "../ui/visuallyHidden";

type RecipeSearchItem = NonNullable<RecipesListQueryResult>[number];

type SearchItem =
  | {
      type: "recipe";
      recipe: RecipeSearchItem;
    }
  | {
      type: "view-all";
      query: string;
    };

const createSearchItem = (recipe: RecipeSearchItem): SearchItem | undefined =>
  recipe.slug
    ? {
        type: "recipe",
        recipe,
      }
    : undefined;

const isDefined = <T,>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;

export const NavSearch = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] =
    useState<RecipesListQueryResult | null>(null);
  const [highlightedItem, setHighlightedItem] = useState<SearchItem>();
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);

  const searchItems: SearchItem[] = (searchResults ?? [])
    ?.map(createSearchItem)
    .filter(isDefined);

  if (searchItems.length > 0) {
    searchItems.push({
      type: "view-all",
      query: inputValue,
    });
  }

  const resultCount = searchItems.filter(
    (item) => item.type === "recipe",
  ).length;

  const statusMessage = !inputValue
    ? ""
    : isPending || isSearching
      ? "Laster søkeresultater"
      : resultCount > 0
        ? `${resultCount} ${resultCount === 1 ? "oppskrift" : "oppskrifter"} funnet`
        : "Ingen oppskrifter funnet";

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
    setHighlightedItem(undefined);
    setIsSearching(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setHighlightedItem(undefined);
    if (newValue) {
      setIsOpen(true);
      setIsSearching(true);
      performSearch(newValue);
    } else {
      handleClear();
    }
  };

  const blurInput = () => {
    inputRef.current?.blur();
  };

  const getItemHref = (item: SearchItem) =>
    item.type === "view-all"
      ? `/oppskrifter?query=${encodeURIComponent(item.query)}`
      : `/oppskrifter/${item.recipe.slug}`;

  const navigateToItem = (item: SearchItem) => {
    blurInput();
    router.push(getItemHref(item));
    handleClear();
  };

  const viewAllHref = `/oppskrifter?query=${encodeURIComponent(inputValue)}`;

  const handleViewAll = () => {
    navigateToItem({
      type: "view-all",
      query: inputValue,
    });
  };

  const handleKeyDown = (e: BaseUIEvent<KeyboardEvent<HTMLInputElement>>) => {
    if (e.key === "Enter" && highlightedItem) {
      e.preventDefault();
      e.preventBaseUIHandler();
      navigateToItem(highlightedItem);
      return;
    }

    if (
      e.key === "Enter" &&
      highlightedItem === undefined &&
      searchItems.some((item) => item.type === "view-all")
    ) {
      e.preventDefault();
      e.preventBaseUIHandler();
      handleViewAll();
    }
  };

  return (
    <AutocompletePrimitive.Root<SearchItem>
      items={searchItems}
      mode="none"
      value={inputValue}
      open={isOpen}
      onValueChange={(value, eventDetails) => {
        if (eventDetails.reason === "item-press") {
          return;
        }

        handleInputChange(value);
      }}
      onOpenChange={(open) => {
        setIsOpen(open && !!inputValue);
        if (!open) {
          setHighlightedItem(undefined);
        }
      }}
      onItemHighlighted={(item) => {
        setHighlightedItem(item);
      }}
      itemToStringValue={(item) =>
        item.type === "recipe" ? (item.recipe.title ?? "") : item.query
      }
    >
      <div className="relative w-full">
        <div className="relative">
          <Search className="text-accent-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <AutocompletePrimitive.Input
            render={<Input ref={inputRef} type="text" />}
            placeholder="Søk..."
            className="bg-background text-accent-foreground w-full pr-10 pl-10"
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue && (searchResults || isSearching)) {
                setIsOpen(true);
              }
            }}
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="text-accent-foreground absolute top-1/2 right-3 -translate-y-1/2 transform hover:cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <AutocompletePrimitive.Portal>
        <AutocompletePrimitive.Positioner
          className="isolate z-50"
          side="bottom"
          sideOffset={4}
          align="start"
        >
          <AutocompletePrimitive.Popup
            className="bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-(--anchor-width) rounded-md border p-0 shadow-lg outline-hidden md:w-auto md:min-w-(--anchor-width)"
            initialFocus={false}
          >
            <AutocompletePrimitive.Status render={<VisuallyHidden />}>
              {statusMessage}
            </AutocompletePrimitive.Status>
            <AutocompletePrimitive.Empty>
              {isPending || isSearching ? (
                <div className="flex items-center justify-center p-6">
                  <SpinnerIcon className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="text-muted-foreground p-6 text-center">
                  Ingen oppskrifter funnet
                </div>
              )}
            </AutocompletePrimitive.Empty>
            <AutocompletePrimitive.List
              className={cn(
                "max-h-144 overflow-y-auto",
                isPending && searchItems.length > 0 && "opacity-60",
              )}
            >
              {(item: SearchItem) => {
                if (item.type === "view-all") {
                  return (
                    <AutocompletePrimitive.Item
                      key="view-all"
                      value={item}
                      onClick={(e) => {
                        e.preventBaseUIHandler();
                        blurInput();
                        handleClear();
                      }}
                      render={<Link href={viewAllHref} prefetch />}
                      nativeButton={false}
                      className="data-highlighted:bg-accent bg-background flex cursor-default items-center justify-center border-t p-3 text-center text-sm font-medium outline-hidden select-none"
                    >
                      Se alle resultater for &quot;{item.query}&quot;
                    </AutocompletePrimitive.Item>
                  );
                }

                const { recipe } = item;
                const duration = formatDurationShort(recipe.totalTime);
                const imageUrl = recipe.mainImage
                  ? urlForImage(recipe.mainImage)
                      ?.width(96)
                      .height(96)
                      .fit("crop")
                      .url()
                  : null;
                const recipeHref = `/oppskrifter/${recipe.slug}`;

                return (
                  <AutocompletePrimitive.Item
                    key={recipe._id}
                    value={item}
                    onClick={(e) => {
                      e.preventBaseUIHandler();
                      blurInput();
                      handleClear();
                    }}
                    render={<Link href={recipeHref} prefetch />}
                    nativeButton={false}
                    className="hover:bg-accent bg-background data-highlighted:bg-accent flex cursor-default items-center gap-3 border-b p-3 text-left outline-hidden transition-colors last:border-b-0"
                  >
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt=""
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <h3 className="truncate font-semibold">{recipe.title}</h3>
                      {duration && (
                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                          <Clock3 className="h-3 w-3" /> {duration}
                        </div>
                      )}
                    </div>
                  </AutocompletePrimitive.Item>
                );
              }}
            </AutocompletePrimitive.List>
          </AutocompletePrimitive.Popup>
        </AutocompletePrimitive.Positioner>
      </AutocompletePrimitive.Portal>
    </AutocompletePrimitive.Root>
  );
};
