import { SanityDocument } from "next-sanity";
import { KeyedSegment, Path, PathSegment } from "sanity";

export const createPath = <TDocument extends SanityDocument>(
  path: keyof TDocument & PathSegment,
): Path => [path];

export const scopePath = <TDocument>(
  path: Path,
  scope: (keyof TDocument & PathSegment) | KeyedSegment,
): Path => [...path, scope];
