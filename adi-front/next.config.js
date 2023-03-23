/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    pageExtensions: ['page.tsx', 'api.ts'],
    compiler: {
        styledComponents: true,
    },
};

module.exports = nextConfig;
