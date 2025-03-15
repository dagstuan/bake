import { Path } from "sanity";

export interface OptimisticSortOrderProps {
  children: React.ReactNode;
  /**
   * The id is needed to enable the optimistic state reducer to know if the document being mutated is relevant to the action
   */
  id: string;
  /**
   * Where from the source document we're applying optimistic state
   */
  path: Path;
}
