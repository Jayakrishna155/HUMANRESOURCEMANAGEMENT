/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'kerberos': false,
      'snappy': false,
      '@mongodb-js/zstd': false,
      '@aws-sdk/credential-providers': false,
      'gcp-metadata': false,
      'socks': false,
      'aws4': false,
      'mongodb-client-encryption': false,
    }
    return config;
  }
}

module.exports = nextConfig;
