import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {},
  // allowedDevOrigins: ["192.168.1.1"], // Substitua pelo IP do seu dispositivo
};

export default withSerwist(nextConfig);
