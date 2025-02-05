import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  apiVersion: "2025-02-05",
  useCdn: false,
});

const appOrigin = process.env.APP_ORIGIN;
const appRoute = new URL("/api/revalidate-tag", appOrigin);

await new Promise((resolve, reject) => {
  client.live.events().subscribe({
    next: (event) => {
      if (event.type === "welcome") {
        console.info(
          `Connected to the Sanity Live Content API, events will be forwarded to ${appOrigin} on a protected route which expires tag entries`,
        );
      } else if (event.type === "message") {
        const body = {
          ...event,
          secret: process.env.SECRET ?? "",
        };

        const url = new URL(appRoute);
        fetch(url, { method: "POST", body: JSON.stringify(body) })
          .then((res) => {
            if (!res.ok) {
              throw new TypeError("Failed", { cause: res.statusText });
            }
            return res.json();
          })
          .then((json) => {
            console.info("Forwarded tags to api route", event.tags, json);
          })
          .catch((reason: unknown) => {
            console.error(
              "Failed to forward tags to api route",
              event,
              reason,
              url.toString(),
            );
          });
      }
    },
    error: (error: Error) => {
      reject(error);
    },
    complete: () => {
      resolve(undefined);
    },
  });
});
