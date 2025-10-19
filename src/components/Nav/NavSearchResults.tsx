import { RecipesListQueryResult } from "../../../sanity.types";
import { formatDurationShort } from "@/utils/durationUtils";
import { ClockIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { urlForImage } from "@/sanity/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NavSearchResultsProps {
  results: RecipesListQueryResult | null;
  isPending: boolean;
  query: string;
  onResultClick: (slug: string) => void;
  onViewAll: () => void;
  selectedIndex: number;
}

export const NavSearchResults = ({
  results,
  isPending,
  query,
  onResultClick,
  onViewAll,
  selectedIndex,
}: NavSearchResultsProps) => {
  return (
    <>
      {results && results.length > 0 ? (
        <div className={cn("flex flex-col", isPending && "opacity-60")}>
          {results.map((recipe, index) => {
            const { _id, slug, title, mainImage, totalTime } = recipe;

            if (!slug) return null;

            const duration = formatDurationShort(totalTime);
            const imageUrl = mainImage
              ? urlForImage(mainImage)?.width(96).height(96).fit("crop").url()
              : null;

            const isSelected = index === selectedIndex;

            return (
              <Link
                key={_id}
                href={`/oppskrifter/${slug}`}
                onClick={() => {
                  onResultClick(slug);
                }}
                className={cn(
                  "hover:bg-accent flex cursor-pointer items-center gap-3 border-b bg-white p-3 text-left transition-colors last:border-b-0",
                  isSelected && "bg-accent",
                )}
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
                  <h3 className="truncate font-semibold">{title}</h3>
                  {duration && (
                    <div className="text-muted-foreground flex items-center gap-1 text-sm">
                      <ClockIcon className="h-3 w-3" /> {duration}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
          <div className="border-t p-3">
            <Button
              asChild
              variant={selectedIndex === results.length ? "default" : "outline"}
              size="sm"
              className="w-full"
            >
              <Link
                onClick={onViewAll}
                href={`/oppskrifter?query=${encodeURIComponent(query)}`}
              >
                Se alle resultater for &quot;{query}&quot;
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground p-6 text-center">
          Ingen oppskrifter funnet
        </div>
      )}
    </>
  );
};
