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
  async redirects() {   // 访问根路径 '/' 时，自动重定向到 /marketing 页面
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
