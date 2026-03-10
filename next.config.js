/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/node_modules', '**/.git', '**/pagefile.sys', '**/hiberfil.sys'],
    }
    return config
  },
}

module.exports = nextConfig
