/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/GPP-Floor-Check" : "",
  images: { unoptimized: true },
};
export default nextConfig;
