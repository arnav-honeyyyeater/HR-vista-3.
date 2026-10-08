import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A live dev preview must not overwrite the production chunks being reviewed.
  distDir: process.env.NODE_ENV === "production" ? ".next-production" : ".next",

  // Pin the tracing root to this project. Without it Next walks up, finds an
  // unrelated lockfile in the user's home directory and treats that as the
  // workspace root, which makes every build print a warning and can pull the
  // wrong files into the output trace.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
