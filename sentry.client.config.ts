import { init } from "@sentry/nextjs";

init({
  enabled: process.env.NODE_ENV !== "development",

  dsn: "https://0fb330db3a98b6acb34139db0f4e5516@o4508195146694656.ingest.de.sentry.io/4508195147939920",
  tracesSampleRate: 0.5,
  debug: false,
});
