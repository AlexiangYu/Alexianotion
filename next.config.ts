/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
      remotePatterns: [
          {
              hostname: "files.edgestore.dev",
          }
      ]
  },
  async redirects() {
      return [
          {
              source: '/',
              destination: '/marketing',
              permanent: true, // 使用永久重定向（301）
          },
      ];
  },
};

export default nextConfig;
