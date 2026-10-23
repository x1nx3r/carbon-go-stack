import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Carbon ships deprecation warnings from its own Sass; they are not ours
  // to fix and drown out the build output.
  sassOptions: {
    quietDeps: true,
  },
};

export default nextConfig;
