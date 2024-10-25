import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, studioUrl } from "../env";

export const client = createClient({
  projectId,
  dataset,
  useCdn: true,
  apiVersion,
  stega: { studioUrl },
});
