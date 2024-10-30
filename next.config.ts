import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },
};

export default withSentryConfig(nextConfig, {
  org: "dag-stuan",
  project: "bakdel",
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
  widenClientFileUpload: true,
});
