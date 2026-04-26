/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    'vm-8fltk4t5mpv0tujty0nmjei5.vusercontent.net',
    'localhost:3000',
  ],
}

export default nextConfig
