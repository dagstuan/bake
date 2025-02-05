import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import * as v from "valibot";

const revalidateRequest = v.object({
  secret: v.string(),
  type: v.literal("message"),
  tags: v.array(v.string()),
});

export const POST = async (request: NextRequest) => {
  const parsedRequest = v.safeParse(revalidateRequest, await request.json());
  if (!parsedRequest.success) {
    return new Response("Failed to parse request", { status: 400 });
  }
  const { tags, secret } = parsedRequest.output;

  if (secret !== process.env.REVALIDATE_TAG_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  for (const _tag of tags) {
    const tag = `sanity:${_tag}`;
    revalidateTag(tag);

    console.log(`revalidated tag: ${tag}`);
  }

  return Response.json({ success: true });
};
