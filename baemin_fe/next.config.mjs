/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // Đặt là false nếu bạn muốn điều hướng tạm thời (HTTP 302)
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3030",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
