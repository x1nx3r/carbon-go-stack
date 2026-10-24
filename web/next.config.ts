import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Agents open the dev server through 127.0.0.1; Next blocks its dev
  // resources from a different hostname by default.
  allowedDevOrigins: ["127.0.0.1"],
  // Keep screenshots (and the agent's visual checks) free of the dev badge.
  devIndicators: false,
  partialPrefetching: true,
  // Carbon ships deprecation warnings from its own Sass; they are not ours
  // to fix and drown out the build output.
  sassOptions: {
    quietDeps: true,
  },
};

export default nextConfig;
