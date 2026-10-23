import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Carbon's styles emit local font URLs prefixed with "~" (webpack's
  // node_modules marker). Turbopack does not resolve those, so this starter
  // builds and runs with webpack until Carbon ships bare specifiers.
  sassOptions: {
    quietDeps: true,
  },
};

export default nextConfig;
