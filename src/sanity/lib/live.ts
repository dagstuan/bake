import { defineLive } from "next-sanity";
import { token } from "./token";
import { client } from "./client";

export const { sanityFetch, SanityLive, SanityLiveStream } = defineLive({
  client,
  browserToken: token,
  serverToken: token,
});
