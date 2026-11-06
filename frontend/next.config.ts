import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Fast Refresh working for both local preview addresses.
  allowedDevOrigins: ["127.0.0.1"],
  reactCompiler: true,
};

export default nextConfig;
