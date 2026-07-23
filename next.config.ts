import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/events", destination: "/#events", permanent: false },
      { source: "/gallery", destination: "/#events", permanent: false },
      { source: "/contact", destination: "/#footer", permanent: false },
      { source: "/join", destination: "/#footer", permanent: false },
      { source: "/community", destination: "/about", permanent: false },
      { source: "/projects", destination: "/about", permanent: false },
      { source: "/blog", destination: "/about", permanent: false },
      { source: "/resources", destination: "/about", permanent: false },
    ];
  },
};

export default nextConfig;
