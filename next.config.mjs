/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.137.1','localhost'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
