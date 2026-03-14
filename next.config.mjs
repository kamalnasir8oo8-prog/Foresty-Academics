/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: false,
  serverExternalPackages: ["mongoose", "jsonwebtoken", "bcryptjs"],
};

export default nextConfig;
