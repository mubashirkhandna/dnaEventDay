/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias['pdfjs-dist/build/pdf.worker.min.mjs'] = false;
    return config;
  },
};

module.exports = nextConfig;
