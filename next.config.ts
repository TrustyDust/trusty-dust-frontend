// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          publicPath: '/_next/static/images/',
          outputPath: 'static/images/',
          name: '[name].[hash].[ext]',
        },
      },
    });
    return config;
  },
};

export default nextConfig;
